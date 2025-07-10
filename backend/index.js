const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "kebonkito_trailrun",
};

const dbTrailRun = mysql.createPool(dbConfig);

// const initDB = async () => {
//   try {
//     db = await mysql.createConnection(dbConfig);
//     console.log('Database connected successfully');
//   } catch (error) {
//     console.error('Database connection failed:', error);
//     process.exit(1);
//   }
// };

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || "your-secret-key",
    (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }
      req.user = user;
      next();
    }
  );
};

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

// Auth routes
app.post("/api/trailrun/auth/register", async (req, res) => {
  try {
    const { name, email, password, phone, emergencyContact } = req.body;

    // Check if user already exists
    const [existingUser] = await dbTrailRun.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await dbTrailRun.execute(
      "INSERT INTO users (name, email, password, phone, emergency_contact) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, phone, emergencyContact]
    );

    // Generate token
    const token = jwt.sign(
      { id: result.insertId, email, role: "user" },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: result.insertId,
        name,
        email,
        phone,
        emergencyContact,
        role: "user",
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/trailrun/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Get user
    const [users] = await dbTrailRun.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (users.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = users[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        emergencyContact: user.emergency_contact,
        role: user.role,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/trailrun/auth/me", authenticateToken, async (req, res) => {
  try {
    const [users] = await dbTrailRun.execute("SELECT * FROM users WHERE id = ?", [
      req.user.id,
    ]);
    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        emergencyContact: user.emergency_contact,
        role: user.role,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Events routes
app.get("/api/trailrun/events", async (req, res) => {
  try {
    const [events] = await dbTrailRun.execute(`
      SELECT e.*, 
             COALESCE(COUNT(r.id), 0) as registeredCount
      FROM events e
      LEFT JOIN registrations r ON e.id = r.event_id AND r.payment_status = 'confirmed'
      GROUP BY e.id
      ORDER BY e.date ASC
    `);

    // Transform snake_case to camelCase
    const transformedEvents = events.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      category: event.category,
      distance: event.distance,
      price: event.price,
      maxParticipants: event.max_participants,
      image: event.image,
      createdAt: event.created_at,
      updatedAt: event.updated_at,
      registeredCount: event.registeredCount,
    }));

    res.json(transformedEvents);
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/trailrun/events/:id", async (req, res) => {
  try {
    const [events] = await dbTrailRun.execute(
      `
      SELECT e.*, 
             COALESCE(COUNT(r.id), 0) as registeredCount
      FROM events e
      LEFT JOIN registrations r ON e.id = r.event_id AND r.payment_status = 'confirmed'
      WHERE e.id = ?
      GROUP BY e.id
    `,
      [req.params.id]
    );

    if (events.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    const event = events[0];
    // Transform snake_case to camelCase
    const transformedEvent = {
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      category: event.category,
      distance: event.distance,
      price: event.price,
      maxParticipants: event.max_participants,
      image: event.image,
      createdAt: event.created_at,
      updatedAt: event.updated_at,
      registeredCount: event.registeredCount,
    };

    res.json(transformedEvent);
  } catch (error) {
    console.error("Get event error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/trailrun/events/:id/register", authenticateToken, async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    // Check if event exists
    const [events] = await dbTrailRun.execute("SELECT * FROM events WHERE id = ?", [
      eventId,
    ]);
    if (events.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    const event = events[0];

    // Check if user already registered
    const [existingRegistration] = await dbTrailRun.execute(
      "SELECT id FROM registrations WHERE event_id = ? AND user_id = ?",
      [eventId, userId]
    );

    if (existingRegistration.length > 0) {
      return res
        .status(400)
        .json({ message: "Already registered for this event" });
    }

    // Check if event is full
    const [registrationCount] = await dbTrailRun.execute(
      'SELECT COUNT(*) as count FROM registrations WHERE event_id = ? AND payment_status = "confirmed"',
      [eventId]
    );

    if (registrationCount[0].count >= event.max_participants) {
      return res.status(400).json({ message: "Event is full" });
    }

    // Create registration
    const [result] = await dbTrailRun.execute(
      'INSERT INTO registrations (event_id, user_id, payment_status) VALUES (?, ?, "pending")',
      [eventId, userId]
    );

    res.status(201).json({
      message: "Registration successful",
      id: result.insertId,
      eventId,
      userId,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Payment routes
app.get("/api/trailrun/payment-methods", async (req, res) => {
  try {
    const [methods] = await dbTrailRun.execute(
      "SELECT * FROM payment_methods WHERE active = 1"
    );

    // Transform snake_case to camelCase
    const transformedMethods = methods.map((method) => ({
      id: method.id,
      name: method.name,
      type: method.type,
      description: method.description,
      accountNumber: method.account_number,
      accountName: method.account_name,
      qrCode: method.qr_code,
      active: method.active,
      createdAt: method.created_at,
      updatedAt: method.updated_at,
    }));

    res.json(transformedMethods);
  } catch (error) {
    console.error("Get payment methods error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/trailrun/registrations/user", authenticateToken, async (req, res) => {
  try {
    console.log("Fetching registrations for user ID:", req.user.id);

    // First, check if user exists
    const [users] = await dbTrailRun.execute("SELECT * FROM users WHERE id = ?", [
      req.user.id,
    ]);
    console.log("User found:", users.length > 0);

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user has any registrations
    const [registrationCount] = await dbTrailRun.execute(
      "SELECT COUNT(*) as count FROM registrations WHERE user_id = ?",
      [req.user.id]
    );
    console.log("Total registrations for user:", registrationCount[0].count);

    const [registrations] = await dbTrailRun.execute(
      `
      SELECT r.*, e.title, e.description, e.date, e.time, e.location, e.category, e.distance, e.price
      FROM registrations r
      JOIN events e ON r.event_id = e.id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
    `,
      [req.user.id]
    );

    console.log("Found registrations with event data:", registrations.length);

    const formattedRegistrations = registrations.map((reg) => ({
      id: reg.id,
      paymentStatus: reg.payment_status,
      createdAt: reg.created_at,
      event: {
        title: reg.title,
        description: reg.description,
        date: reg.date,
        time: reg.time,
        location: reg.location,
        category: reg.category,
        distance: reg.distance,
        price: reg.price,
      },
    }));

    res.json(formattedRegistrations);
  } catch (error) {
    console.error("Get user registrations error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/trailrun/registrations/:id", authenticateToken, async (req, res) => {
  try {
    console.log("Fetching registration for user ID:", req.user.id);
    console.log("Fetching registration for params ID:", req.params.id);

    const [registrations] = await dbTrailRun.execute(
      `
      SELECT r.*, e.title, e.description, e.date, e.time, e.location, e.category, e.distance, e.price
      FROM registrations r
      JOIN events e ON r.event_id = e.id
      WHERE r.id = ? AND r.user_id = ?
    `,
      [req.params.id, req.user.id]
    );

    if (registrations.length === 0) {
      return res.status(404).json({ message: "Registration not found" });
    }

    const registration = registrations[0];
    res.json({
      id: registration.id,
      paymentStatus: registration.payment_status,
      createdAt: registration.created_at,
      event: {
        title: registration.title,
        description: registration.description,
        date: registration.date,
        time: registration.time,
        location: registration.location,
        category: registration.category,
        distance: registration.distance,
        price: registration.price,
      },
    });
  } catch (error) {
    console.error("Get registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post(
  "/api/trailrun/registrations/:id/payment",
  authenticateToken,
  async (req, res) => {
    try {
      const { paymentMethodId } = req.body;

      // Update payment method
      await dbTrailRun.execute(
        "UPDATE registrations SET payment_method_id = ? WHERE id = ? AND user_id = ?",
        [paymentMethodId, req.params.id, req.user.id]
      );

      res.json({ message: "Payment confirmation submitted" });
    } catch (error) {
      console.error("Payment error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// FAQ routes
app.get("/api/trailrun/faqs", async (req, res) => {
  try {
    const [faqs] = await dbTrailRun.execute(
      "SELECT * FROM faqs ORDER BY created_at DESC"
    );
    res.json(faqs);
  } catch (error) {
    console.error("Get FAQs error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin routes
app.get(
  "/api/trailrun/admin/dashboard",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const [totalUsers] = await dbTrailRun.execute(
        "SELECT COUNT(*) as count FROM users"
      );
      const [totalEvents] = await dbTrailRun.execute(
        "SELECT COUNT(*) as count FROM events"
      );
      const [totalRevenue] = await dbTrailRun.execute(
        'SELECT SUM(e.price) as total FROM registrations r JOIN events e ON r.event_id = e.id WHERE r.payment_status = "confirmed"'
      );
      const [pendingPayments] = await dbTrailRun.execute(
        'SELECT COUNT(*) as count FROM registrations WHERE payment_status = "pending"'
      );

      const [recentRegistrations] = await dbTrailRun.execute(`
      SELECT r.*, u.name as user_name, e.title as event_title
      FROM registrations r
      JOIN users u ON r.user_id = u.id
      JOIN events e ON r.event_id = e.id
      ORDER BY r.created_at DESC
      LIMIT 5
    `);

      const [upcomingEvents] = await dbTrailRun.execute(`
      SELECT e.*, COALESCE(COUNT(r.id), 0) as registeredCount
      FROM events e
      LEFT JOIN registrations r ON e.id = r.event_id AND r.payment_status = 'confirmed'
      WHERE e.date >= CURDATE()
      GROUP BY e.id
      ORDER BY e.date ASC
      LIMIT 5
    `);

      res.json({
        totalUsers: totalUsers[0].count,
        totalEvents: totalEvents[0].count,
        totalRevenue: totalRevenue[0].total || 0,
        pendingPayments: pendingPayments[0].count,
        recentRegistrations: recentRegistrations.map((reg) => ({
          id: reg.id,
          createdAt: reg.created_at,
          paymentStatus: reg.payment_status,
          user: { name: reg.user_name },
          event: { title: reg.event_title },
        })),
        upcomingEvents: upcomingEvents.map((event) => ({
          id: event.id,
          title: event.title,
          date: event.date,
          location: event.location,
          maxParticipants: event.max_participants,
          registeredCount: event.registeredCount,
        })),
      });
    } catch (error) {
      console.error("Dashboard error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

app.get(
  "/api/trailrun/admin/events",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const [events] = await dbTrailRun.execute(`
      SELECT e.*, COALESCE(COUNT(r.id), 0) as registeredCount
      FROM events e
      LEFT JOIN registrations r ON e.id = r.event_id AND r.payment_status = 'confirmed'
      GROUP BY e.id
      ORDER BY e.date ASC
    `);

      // Transform snake_case to camelCase
      const transformedEvents = events.map((event) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location,
        category: event.category,
        distance: event.distance,
        price: event.price,
        maxParticipants: event.max_participants,
        image: event.image,
        createdAt: event.created_at,
        updatedAt: event.updated_at,
        registeredCount: event.registeredCount,
      }));

      res.json(transformedEvents);
    } catch (error) {
      console.error("Get admin events error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

app.post(
  "/api/trailrun/admin/events",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const {
        title,
        description,
        date,
        time,
        location,
        category,
        distance,
        price,
        maxParticipants,
        image,
      } = req.body;

      const [result] = await dbTrailRun.execute(
        "INSERT INTO events (title, description, date, time, location, category, distance, price, max_participants, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          title,
          description,
          date,
          time,
          location,
          category,
          distance,
          price,
          maxParticipants,
          image,
        ]
      );

      res
        .status(201)
        .json({ message: "Event created successfully", id: result.insertId });
    } catch (error) {
      console.error("Create event error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

app.put(
  "/api/trailrun/admin/events/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const {
        title,
        description,
        date,
        time,
        location,
        category,
        distance,
        price,
        maxParticipants,
        image,
      } = req.body;

      await dbTrailRun.execute(
        "UPDATE events SET title = ?, description = ?, date = ?, time = ?, location = ?, category = ?, distance = ?, price = ?, max_participants = ?, image = ? WHERE id = ?",
        [
          title,
          description,
          date,
          time,
          location,
          category,
          distance,
          price,
          maxParticipants,
          image,
          req.params.id,
        ]
      );

      res.json({ message: "Event updated successfully" });
    } catch (error) {
      console.error("Update event error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

app.delete(
  "/api/trailrun/admin/events/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      await dbTrailRun.execute("DELETE FROM events WHERE id = ?", [req.params.id]);
      res.json({ message: "Event deleted successfully" });
    } catch (error) {
      console.error("Delete event error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

app.get(
  "/api/trailrun/admin/payments",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const [payments] = await dbTrailRun.execute(`
      SELECT r.*, u.name as user_name, u.email as user_email, e.title as event_title, e.price as event_price
      FROM registrations r
      JOIN users u ON r.user_id = u.id
      JOIN events e ON r.event_id = e.id
      ORDER BY r.created_at DESC
    `);

      const formattedPayments = payments.map((payment) => ({
        id: payment.id,
        paymentStatus: payment.payment_status,
        createdAt: payment.created_at,
        user: {
          name: payment.user_name,
          email: payment.user_email,
        },
        event: {
          title: payment.event_title,
          price: payment.event_price,
        },
      }));

      res.json(formattedPayments);
    } catch (error) {
      console.error("Get admin payments error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

app.put(
  "/api/trailrun/admin/payments/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { status } = req.body;

      await dbTrailRun.execute(
        "UPDATE registrations SET payment_status = ? WHERE id = ?",
        [status, req.params.id]
      );

      res.json({ message: "Payment status updated successfully" });
    } catch (error) {
      console.error("Update payment status error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

app.get(
  "/api/trailrun/admin/payment-methods",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const [methods] = await dbTrailRun.execute(
        "SELECT * FROM payment_methods ORDER BY created_at DESC"
      );

      // Transform snake_case to camelCase
      const transformedMethods = methods.map((method) => ({
        id: method.id,
        name: method.name,
        type: method.type,
        description: method.description,
        accountNumber: method.account_number,
        accountName: method.account_name,
        qrCode: method.qr_code,
        active: method.active,
        createdAt: method.created_at,
        updatedAt: method.updated_at,
      }));

      res.json(transformedMethods);
    } catch (error) {
      console.error("Get admin payment methods error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

app.post(
  "/api/trailrun/admin/payment-methods",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { name, type, description, accountNumber, accountName, qrCode } =
        req.body;

      const [result] = await dbTrailRun.execute(
        "INSERT INTO payment_methods (name, type, description, account_number, account_name, qr_code) VALUES (?, ?, ?, ?, ?, ?)",
        [name, type, description, accountNumber, accountName, qrCode]
      );

      res
        .status(201)
        .json({
          message: "Payment method created successfully",
          id: result.insertId,
        });
    } catch (error) {
      console.error("Create payment method error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

app.put(
  "/api/trailrun/admin/payment-methods/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { name, type, description, accountNumber, accountName, qrCode } =
        req.body;

      await dbTrailRun.execute(
        "UPDATE payment_methods SET name = ?, type = ?, description = ?, account_number = ?, account_name = ?, qr_code = ? WHERE id = ?",
        [
          name,
          type,
          description,
          accountNumber,
          accountName,
          qrCode,
          req.params.id,
        ]
      );

      res.json({ message: "Payment method updated successfully" });
    } catch (error) {
      console.error("Update payment method error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

app.delete(
  "/api/trailrun/admin/payment-methods/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      await dbTrailRun.execute("DELETE FROM payment_methods WHERE id = ?", [
        req.params.id,
      ]);
      res.json({ message: "Payment method deleted successfully" });
    } catch (error) {
      console.error("Delete payment method error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

app.get(
  "/api/trailrun/admin/faqs",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const [faqs] = await dbTrailRun.execute(
        "SELECT * FROM faqs ORDER BY created_at DESC"
      );
      res.json(faqs);
    } catch (error) {
      console.error("Get admin FAQs error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

app.post(
  "/api/trailrun/admin/faqs",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { question, answer } = req.body;

      const [result] = await dbTrailRun.execute(
        "INSERT INTO faqs (question, answer) VALUES (?, ?)",
        [question, answer]
      );

      res
        .status(201)
        .json({ message: "FAQ created successfully", id: result.insertId });
    } catch (error) {
      console.error("Create FAQ error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

app.put(
  "/api/trailrun/admin/faqs/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { question, answer } = req.body;

      await dbTrailRun.execute(
        "UPDATE faqs SET question = ?, answer = ? WHERE id = ?",
        [question, answer, req.params.id]
      );

      res.json({ message: "FAQ updated successfully" });
    } catch (error) {
      console.error("Update FAQ error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

app.delete(
  "/api/trailrun/admin/faqs/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      await dbTrailRun.execute("DELETE FROM faqs WHERE id = ?", [req.params.id]);
      res.json({ message: "FAQ deleted successfully" });
    } catch (error) {
      console.error("Delete FAQ error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

app.get(
  "/api/trailrun/admin/users",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const [users] = await dbTrailRun.execute(`
      SELECT u.*, COUNT(r.id) as registrationCount
      FROM users u
      LEFT JOIN registrations r ON u.id = r.user_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);

      res.json(users);
    } catch (error) {
      console.error("Get admin users error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

app.put(
  "/api/trailrun/admin/users/:id/role",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { role } = req.body;

      await dbTrailRun.execute("UPDATE users SET role = ? WHERE id = ?", [
        role,
        req.params.id,
      ]);

      res.json({ message: "User role updated successfully" });
    } catch (error) {
      console.error("Update user role error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Test endpoint to check database
app.get("/api/trailrun/test/db", async (req, res) => {
  try {
    const [users] = await dbTrailRun.execute("SELECT COUNT(*) as count FROM users");
    const [events] = await dbTrailRun.execute("SELECT COUNT(*) as count FROM events");
    const [registrations] = await dbTrailRun.execute(
      "SELECT COUNT(*) as count FROM registrations"
    );

    res.json({
      users: users[0].count,
      events: events[0].count,
      registrations: registrations[0].count,
    });
  } catch (error) {
    console.error("Test endpoint error:", error);
    res.status(500).json({ message: "Database test failed" });
  }
});

// Initialize database and start server
// initDB().then(() => {
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// });
