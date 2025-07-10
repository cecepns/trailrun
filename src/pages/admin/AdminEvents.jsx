import { useState, useEffect } from 'react';
import axios from 'axios';
import { formatRupiah } from '../../utils/formatRupiah';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  CalendarIcon,
  MapPinIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    distance: '',
    price: '',
    maxParticipants: '',
    image: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('https://api-inventory.isavralabel.com/api/trailrun/admin/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingEvent) {
        await axios.put(`https://api-inventory.isavralabel.com/api/trailrun/admin/events/${editingEvent.id}`, formData);
      } else {
        await axios.post('https://api-inventory.isavralabel.com/api/trailrun/admin/events', formData);
      }
      
      fetchEvents();
      resetForm();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date.split('T')[0],
      time: event.time,
      location: event.location,
      category: event.category,
      distance: event.distance,
      price: event.price,
      maxParticipants: event.maxParticipants,
      image: event.image || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus event ini?')) {
      try {
        await axios.delete(`https://api-inventory.isavralabel.com/api/trailrun/admin/events/${id}`);
        fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      category: '',
      distance: '',
      price: '',
      maxParticipants: '',
      image: ''
    });
    setEditingEvent(null);
    setShowForm(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kelola Events</h1>
            <p className="text-gray-600">Tambah, edit, dan hapus event trail running</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Tambah Event
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">
                  {editingEvent ? 'Edit Event' : 'Tambah Event Baru'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Judul Event
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deskripsi
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={3}
                      className="input-field"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tanggal
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Waktu
                      </label>
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lokasi
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kategori
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className="input-field"
                      >
                        <option value="">Pilih Kategori</option>
                        <option value="trail">Trail</option>
                        <option value="ultra">Ultra</option>
                        <option value="fun-run">Fun Run</option>
                        <option value="marathon">Marathon</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Jarak (km)
                      </label>
                      <input
                        type="number"
                        name="distance"
                        value={formData.distance}
                        onChange={handleChange}
                        required
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Harga (Rp)
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Peserta
                      </label>
                      <input
                        type="number"
                        name="maxParticipants"
                        value={formData.maxParticipants}
                        onChange={handleChange}
                        required
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL Gambar
                    </label>
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="btn-outline"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      {editingEvent ? 'Update' : 'Simpan'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Events List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="card">
              <div className="relative">
                <img 
                  src={event.image || "https://images.pexels.com/photos/2402926/pexels-photo-2402926.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1"} 
                  alt={event.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(event)}
                    className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
              <p className="text-gray-600 mb-4 text-sm">{event.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <span>{new Date(event.date).toLocaleDateString('id-ID')} {event.time}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <UsersIcon className="h-4 w-4 mr-2" />
                  <span>{event.registeredCount || 0}/{event.maxParticipants || 0} peserta</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-primary-600">
                  {formatRupiah(event.price)}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-sm">
                    {event.category}
                  </span>
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                    {event.distance}km
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">Belum ada event yang dibuat</div>
            <p className="text-gray-400 mt-2">Klik tombol "Tambah Event" untuk membuat event baru</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEvents;