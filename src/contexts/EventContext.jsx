import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const EventContext = createContext();

export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
};

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('https://api-inventory.isavralabel.com/api/trailrun/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventById = async (id) => {
    try {
      const response = await axios.get(`https://api-inventory.isavralabel.com/api/trailrun/events/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching event:', error);
      return null;
    }
  };

  const registerForEvent = async (eventId, registrationData) => {
    try {
      const response = await axios.post(`https://api-inventory.isavralabel.com/api/trailrun/events/${eventId}/register`, registrationData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const value = {
    events,
    loading,
    fetchEvents,
    getEventById,
    registerForEvent
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};