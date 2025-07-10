import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEvent } from '../contexts/EventContext';
import { formatRupiah } from '../utils/formatRupiah';
import { 
  MapPinIcon, 
  CalendarIcon, 
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const EventsPage = () => {
  const { events, loading } = useEvent();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const filteredEvents = events
    .filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.date) - new Date(b.date);
      } else if (sortBy === 'price') {
        return a.price - b.price;
      }
      return 0;
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-navy-900 mb-2">Event Trail Running</h1>
          <p className="text-navy-600">Temukan event trail running yang sesuai dengan kemampuan Anda</p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari event atau lokasi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <FunnelIcon className="h-5 w-5 text-navy-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-navy-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">Semua Kategori</option>
                <option value="trail">Trail</option>
                <option value="ultra">Ultra</option>
                <option value="fun-run">Fun Run</option>
                <option value="marathon">Marathon</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-navy-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="date">Urutkan: Tanggal</option>
                <option value="price">Urutkan: Harga</option>
              </select>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div key={event.id} className="card group hover:shadow-2xl transition-shadow duration-300">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img 
                  src={event.image || "https://images.pexels.com/photos/2402926/pexels-photo-2402926.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1"} 
                  alt={event.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {event.category}
                </div>
                <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  {event.distance} km
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
              <p className="text-navy-600 mb-4 line-clamp-2">{event.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-navy-500">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <span>{new Date(event.date).toLocaleDateString('id-ID', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center text-navy-500">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center text-navy-500">
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  <span>{event.location}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t">
                <div>
                  <span className="text-2xl font-bold text-primary-600">
                    {formatRupiah(event.price)}
                  </span>
                  <div className="text-sm text-navy-500">
                    {((event.maxParticipants || 0) - (event.registeredCount || 0))} tersisa
                  </div>
                </div>
                <Link 
                  to={`/events/${event.id}`}
                  className="btn-primary text-sm"
                >
                  Detail
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-navy-500 text-lg">
              Tidak ada event yang ditemukan
            </div>
            <p className="text-navy-400 mt-2">
              Coba ubah filter atau kata kunci pencarian Anda
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;