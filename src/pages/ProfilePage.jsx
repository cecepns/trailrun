import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { formatRupiah } from '../utils/formatRupiah';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon,
  CalendarIcon,
  MapPinIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const ProfilePage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(location.state?.message || '');
  const [editingShirtSize, setEditingShirtSize] = useState(null);
  const [shirtSize, setShirtSize] = useState('');

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        // Get token from localStorage and set it in axios headers
        const token = localStorage.getItem('token');
        console.log('Token from localStorage:', token ? 'present' : 'missing');
        
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          console.log('Authorization header set');
        } else {
          console.log('No token found in localStorage');
        }
        
        console.log('Making request to /api/registrations/user');
        const response = await axios.get('https://api-inventory.isavralabel.com/api/trailrun/registrations/user');
        console.log('Response received:', response.data);
        console.log('Registrations with ukuranBaju:', response.data.map(reg => ({
          id: reg.id,
          ukuranBaju: reg.ukuranBaju
        })));
        setRegistrations(response.data);
        setError(''); // Clear any previous errors
      } catch (error) {
        console.error('Error fetching registrations:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        
        if (error.response?.status === 401 || error.response?.status === 403) {
          setError('Sesi Anda telah berakhir. Silakan login kembali.');
        } else {
          setError('Gagal memuat data registrasi. Silakan coba lagi.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'pending':
        return <ClockIcon className="h-4 w-4" />;
      case 'cancelled':
        return <XCircleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Terkonfirmasi';
      case 'pending':
        return 'Menunggu Verifikasi';
      case 'cancelled':
        return 'Dibatalkan';
      default:
        return 'Pending';
    }
  };

  const handleShirtSizeUpdate = async (registrationId) => {
    try {
      console.log('Updating shirt size for registration:', registrationId, 'with size:', shirtSize);
      
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await axios.put(`https://api-inventory.isavralabel.com/api/trailrun/registrations/${registrationId}/shirt-size`, {
        ukuranBaju: shirtSize
      });
      
      console.log('API response:', response.data);
      
      // Update local state
      setRegistrations(prev => {
        const updated = prev.map(reg => 
          reg.id === registrationId 
            ? { ...reg, ukuranBaju: shirtSize }
            : reg
        );
        console.log('Updated registrations state:', updated);
        return updated;
      });
      
      setEditingShirtSize(null);
      setShirtSize('');
      setMessage('Ukuran baju berhasil diperbarui');
    } catch (error) {
      console.error('Error updating shirt size:', error);
      setError('Gagal memperbarui ukuran baju. Silakan coba lagi.');
    }
  };

  const handleWhatsAppContact = (registration) => {
    const message = `Halo Admin KebonKito TrailRun,

Saya ingin mengkonfirmasi pembayaran untuk registrasi event:

Nama: ${user.name}
Email: ${user.email}
Ukuran Baju: ${registration.ukuranBaju || 'Belum diisi'}
Bank Pengirim: 
Nama Pengirim: 
Bukti Transfer: 

Event: ${registration.event.title}
Tanggal: ${new Date(registration.event.date).toLocaleDateString('id-ID')}
Harga: ${formatRupiah(registration.event.price)}

Mohon konfirmasi pembayaran saya. Terima kasih.`;

    const whatsappUrl = `https://wa.me/62895619804666?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profil Saya</h1>
          <p className="text-gray-600">Kelola informasi profil dan riwayat registrasi event Anda</p>
        </div>

        {message && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserIcon className="h-12 w-12 text-primary-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-600">Member sejak {new Date(user.createdAt).getFullYear()}</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">{user.email}</span>
                </div>
                <div className="flex items-center">
                  <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">{user.phone}</span>
                </div>
                <div className="flex items-center">
                  <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <span className="text-gray-600">Kontak Darurat:</span>
                    <div className="text-sm text-gray-500">{user.emergencyContact}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Registrations */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl font-bold mb-6">Riwayat Registrasi</h2>
              
              {registrations.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-500 text-lg mb-2">Belum ada registrasi event</div>
                  <p className="text-gray-400">Mulai jelajahi event yang tersedia dan daftarkan diri Anda!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {registrations.map((registration) => (
                    <div key={registration.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {registration.event.title}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(registration.paymentStatus)}`}>
                          {getStatusIcon(registration.paymentStatus)}
                          <span className="ml-1">{getStatusText(registration.paymentStatus)}</span>
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          <span>{new Date(registration.event.date).toLocaleDateString('id-ID')}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-2" />
                          <span>{registration.event.location}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-semibold">Kategori:</span>
                          <span className="ml-2">{registration.event.category}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-semibold">Harga:</span>
                          <span className="ml-2">{formatRupiah(registration.event.price)}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-gray-500">
                            Terdaftar pada {new Date(registration.createdAt).toLocaleDateString('id-ID')}
                          </span>
                          {registration.paymentStatus === 'confirmed' && (
                            <span className="text-sm font-medium text-green-600">
                              Siap mengikuti event!
                            </span>
                          )}
                        </div>
                        
                        {/* Shirt Size Section */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Ukuran Baju:</span>
                            {editingShirtSize === registration.id ? (
                              <div className="flex items-center space-x-2">
                                <select
                                  value={shirtSize}
                                  onChange={(e) => setShirtSize(e.target.value)}
                                  className="text-sm border border-gray-300 rounded px-2 py-1"
                                >
                                  <option value="">Pilih ukuran</option>
                                  <option value="XS">XS</option>
                                  <option value="S">S</option>
                                  <option value="M">M</option>
                                  <option value="L">L</option>
                                  <option value="XL">XL</option>
                                  <option value="XXL">XXL</option>
                                </select>
                                <button
                                  onClick={() => handleShirtSizeUpdate(registration.id)}
                                  className="text-xs bg-primary-600 text-white px-2 py-1 rounded hover:bg-primary-700"
                                >
                                  Simpan
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingShirtSize(null);
                                    setShirtSize('');
                                  }}
                                  className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                                >
                                  Batal
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">
                                  {registration.ukuranBaju || 'Belum diisi'}
                                  {console.log('Rendering ukuranBaju for registration', registration.id, ':', registration.ukuranBaju)}
                                </span>
                                <button
                                  onClick={() => {
                                    setEditingShirtSize(registration.id);
                                    setShirtSize(registration.ukuranBaju || '');
                                  }}
                                  className="text-xs text-primary-600 hover:text-primary-700 underline"
                                >
                                  Edit
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* WhatsApp Contact Button */}
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleWhatsAppContact(registration)}
                            className="inline-flex items-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                            Hubungi Admin
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;