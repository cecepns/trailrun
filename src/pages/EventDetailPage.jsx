import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEvent } from '../contexts/EventContext';
import { formatRupiah } from '../utils/formatRupiah';
import { 
  MapPinIcon, 
  CalendarIcon, 
  ClockIcon,
  UsersIcon,
  TrophyIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const EventDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { getEventById, registerForEvent } = useEvent();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState('');
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [ukuranBaju, setUkuranBaju] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      const eventData = await getEventById(id);
      setEvent(eventData);
      setLoading(false);
    };

    fetchEvent();
  }, [id, getEventById]);

  const handleRegister = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setShowRegistrationModal(true);
  };

  const handleRegistrationSubmit = async () => {
    if (!ukuranBaju) {
      setError('Silakan pilih ukuran baju');
      return;
    }

    setRegistering(true);
    setError('');

    const result = await registerForEvent(id, {
      eventId: id,
      userId: user.id,
      ukuranBaju
    });

    if (result.success) {
      setShowRegistrationModal(false);
      setUkuranBaju('');
      navigate(`/payment/${result.data.id}`);
    } else {
      setError(result.error);
    }

    setRegistering(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-navy-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-navy-900 mb-4">Event tidak ditemukan</h1>
          <button onClick={() => navigate('/events')} className="btn-primary">
            Kembali ke Events
          </button>
        </div>
      </div>
    );
  }

  const isEventFull = (event.registeredCount || 0) >= (event.maxParticipants || 0);
  const isEventPassed = new Date(event.date) < new Date();

  return (
    <div className="min-h-screen bg-navy-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gray-900">
        <img 
          src={event.image || "https://images.pexels.com/photos/2402926/pexels-photo-2402926.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"} 
          alt={event.title}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center mb-4">
              <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold mr-3">
                {event.category}
              </span>
              <span className="bg-secondary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {event.distance} km
              </span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">{event.title}</h1>
            <p className="text-xl text-white opacity-90">{event.description}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="card mb-6">
              <h2 className="text-2xl font-bold mb-4">Detail Event</h2>
              <div className="prose max-w-none">
                <p className="text-navy-600 mb-4 whitespace-pre-line">{event.fullDescription || event.description}</p>
                
                {/* <h3 className="text-lg font-semibold mb-2">Informasi Penting</h3>
                <ul className="list-disc list-inside text-navy-600 space-y-1">
                  <li>Pendaftaran dibuka hingga 3 hari sebelum event</li>
                  <li>Peserta wajib hadir 30 menit sebelum start</li>
                  <li>Membawa air minum sendiri</li>
                  <li>Menggunakan sepatu trail running yang sesuai</li>
                  <li>Peserta wajib mengisi surat pernyataan kesehatan</li>
                </ul>
                
                <h3 className="text-lg font-semibold mb-2 mt-6">Fasilitas yang Disediakan</h3>
                <ul className="list-disc list-inside text-navy-600 space-y-1">
                  <li>Medal finisher</li>
                  <li>Sertifikat digital</li>
                  <li>Post point di setiap 5km</li>
                  <li>Tim medis standby</li>
                  <li>Shuttle bus dari titik kumpul</li>
                  <li>Fotografer official</li>
                </ul> */}
              </div>
            </div>

            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Rute & Lokasi</h2>
              <div className="bg-navy-100 rounded-lg p-4 mb-4">
                <div className="flex items-center mb-2">
                  <MapPinIcon className="h-5 w-5 text-primary-600 mr-2" />
                  <span className="font-semibold">Titik Start & Finish</span>
                </div>
                <p className="text-navy-600">{event.location}</p>
              </div>
              <p className="text-navy-600">
                Rute akan melewati jalur trail yang menantang dengan pemandangan alam yang indah. 
                Peserta akan melewati hutan, bukit, dan sungai kecil yang menambah keseruan event ini.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {formatRupiah(event.price)}
                </div>
                <div className="text-sm text-gray-600">per peserta</div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-navy-600">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm">Tanggal</span>
                  </div>
                  <span className="text-sm font-semibold">
                    {new Date(event.date).toLocaleDateString('id-ID')}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-navy-600">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm">Waktu</span>
                  </div>
                  <span className="text-sm font-semibold">{event.time}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-navy-600">
                    <UsersIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm">Tersedia</span>
                  </div>
                  <span className="text-sm font-semibold">
                    {((event.maxParticipants || 0) - (event.registeredCount || 0))} slot
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-navy-600">
                    <TrophyIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm">Kategori</span>
                  </div>
                  <span className="text-sm font-semibold">{event.category}</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <div className="mb-4">
                <div className="bg-navy-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((event.registeredCount || 0) / (event.maxParticipants || 1)) * 100}%` }}
                  ></div>
                </div>
                <div className="text-sm text-navy-600 mt-1">
                  {event.registeredCount || 0} dari {event.maxParticipants || 0} peserta
                </div>
              </div>

              <button
                onClick={handleRegister}
                disabled={registering || isEventFull || isEventPassed}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  isEventFull || isEventPassed
                    ? 'bg-navy-300 text-navy-500 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                {registering ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Mendaftar...
                  </div>
                ) : isEventPassed ? (
                  'Event Sudah Berlalu'
                ) : isEventFull ? (
                  'Event Penuh'
                ) : (
                  'Daftar Sekarang'
                )}
              </button>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-start">
                  <InformationCircleIcon className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Perhatian!</p>
                    <p>Setelah registrasi, Anda akan diarahkan ke halaman pembayaran. Pastikan untuk menyelesaikan pembayaran dalam 24 jam.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showRegistrationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Konfirmasi Registrasi</h2>
              
              <div className="mb-4">
                <p className="text-gray-600 mb-2">Event: <span className="font-semibold">{event.title}</span></p>
                <p className="text-gray-600 mb-4">Harga: <span className="font-semibold">{formatRupiah(event.price)}</span></p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilih Ukuran Baju *
                </label>
                <select
                  value={ukuranBaju}
                  onChange={(e) => setUkuranBaju(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Pilih ukuran baju</option>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                </select>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowRegistrationModal(false);
                    setUkuranBaju('');
                    setError('');
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleRegistrationSubmit}
                  disabled={registering}
                  className="btn-primary px-4 py-2"
                >
                  {registering ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Mendaftar...
                    </div>
                  ) : (
                    'Daftar Sekarang'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetailPage;