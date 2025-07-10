import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { formatRupiah } from '../../utils/formatRupiah';
import { 
  UsersIcon, 
  CalendarIcon, 
  BanknotesIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    recentRegistrations: [],
    upcomingEvents: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('https://api-inventory.isavralabel.com/api/trailrun/admin/dashboard');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Kelola event trail running dan monitoring aktivitas</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-lg">
                <UsersIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-secondary-100 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-secondary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <BanknotesIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatRupiah(stats.totalRevenue)}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Pending Payments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingPayments}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link to="/admin/events" className="card hover:shadow-lg transition-shadow">
            <div className="text-center">
              <CalendarIcon className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Kelola Events</h3>
              <p className="text-sm text-gray-600">Tambah & edit event</p>
            </div>
          </Link>

          <Link to="/admin/payments" className="card hover:shadow-lg transition-shadow">
            <div className="text-center">
              <BanknotesIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Kelola Pembayaran</h3>
              <p className="text-sm text-gray-600">Verifikasi pembayaran</p>
            </div>
          </Link>

          <Link to="/admin/users" className="card hover:shadow-lg transition-shadow">
            <div className="text-center">
              <UsersIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Kelola Users</h3>
              <p className="text-sm text-gray-600">Lihat & kelola user</p>
            </div>
          </Link>

          <Link to="/admin/faq" className="card hover:shadow-lg transition-shadow">
            <div className="text-center">
              <ChartBarIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Kelola FAQ</h3>
              <p className="text-sm text-gray-600">Edit FAQ</p>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Registrations */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Registrasi Terbaru</h2>
            <div className="space-y-3">
              {stats.recentRegistrations.map((registration) => (
                <div key={registration.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">{registration.user.name}</p>
                    <p className="text-sm text-gray-600">{registration.event.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {new Date(registration.createdAt).toLocaleDateString('id-ID')}
                    </p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      registration.paymentStatus === 'confirmed' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {registration.paymentStatus === 'confirmed' ? 'Confirmed' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Event Mendatang</h2>
            <div className="space-y-3">
              {stats.upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-600">{event.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {new Date(event.date).toLocaleDateString('id-ID')}
                    </p>
                    <p className="text-sm font-medium text-primary-600">
                      {event.registeredCount || 0}/{event.maxParticipants || 0} peserta
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;