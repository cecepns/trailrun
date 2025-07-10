import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { formatRupiah } from '../utils/formatRupiah';
import { 
  CreditCardIcon, 
  QrCodeIcon, 
  BanknotesIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';

const PaymentPage = () => {
  const { registrationId } = useParams();
  const navigate = useNavigate();
  
  const [registration, setRegistration] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [regResponse, paymentResponse] = await Promise.all([
          axios.get(`https://api-inventory.isavralabel.com/api/trailrun/registrations/${registrationId}`),
          axios.get('https://api-inventory.isavralabel.com/api/trailrun/payment-methods')
        ]);
        
        setRegistration(regResponse.data);
        setPaymentMethods(paymentResponse.data);
        setSelectedMethod(paymentResponse.data[0]?.id || null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Gagal memuat data pembayaran');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [registrationId]);

  const handlePayment = async () => {
    if (!selectedMethod) {
      setError('Pilih metode pembayaran terlebih dahulu');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await axios.post(`https://api-inventory.isavralabel.com/api/trailrun/registrations/${registrationId}/payment`, {
        paymentMethodId: selectedMethod
      });
      
      navigate('/profile', { 
        state: { message: 'Pembayaran berhasil dikonfirmasi! Menunggu verifikasi admin.' }
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      setError(error.response?.data?.message || 'Gagal memproses pembayaran');
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="min-h-screen bg-navy-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-navy-900 mb-4">Registrasi tidak ditemukan</h1>
          <button onClick={() => navigate('/events')} className="btn-primary">
            Kembali ke Events
          </button>
        </div>
      </div>
    );
  }

  const selectedPaymentMethod = paymentMethods.find(method => method.id === selectedMethod);

  return (
    <div className="min-h-screen bg-navy-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-navy-900 mb-2">Pembayaran</h1>
          <p className="text-navy-600">Selesaikan pembayaran untuk konfirmasi registrasi Anda</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Ringkasan Pesanan</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Event</span>
                <span className="font-semibold">{registration.event.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tanggal</span>
                <span className="font-semibold">
                  {new Date(registration.event.date).toLocaleDateString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Lokasi</span>
                <span className="font-semibold">{registration.event.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Kategori</span>
                <span className="font-semibold">{registration.event.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Jarak</span>
                <span className="font-semibold">{registration.event.distance} km</span>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Pembayaran</span>
                <span className="text-2xl font-bold text-primary-600">
                  {formatRupiah(registration.event.price)}
                </span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-start">
                <ClockIcon className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold mb-1">Batas Waktu Pembayaran</p>
                  <p>Selesaikan pembayaran dalam 24 jam untuk mengkonfirmasi registrasi Anda.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Metode Pembayaran</h2>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}
            
            <div className="space-y-3 mb-6">
              {paymentMethods.map((method) => (
                <div 
                  key={method.id} 
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedMethod === method.id 
                      ? 'border-primary-600 bg-primary-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      {method.type === 'bank' && <BanknotesIcon className="h-6 w-6 text-gray-600" />}
                      {method.type === 'qris' && <QrCodeIcon className="h-6 w-6 text-gray-600" />}
                      {method.type === 'ewallet' && <CreditCardIcon className="h-6 w-6 text-gray-600" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{method.name}</h3>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedMethod === method.id
                          ? 'bg-primary-600 border-primary-600'
                          : 'border-gray-300'
                      }`}>
                        {selectedMethod === method.id && (
                          <CheckCircleIcon className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedPaymentMethod && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Detail Pembayaran</h3>
                <div className="space-y-2">
                  {selectedPaymentMethod.type === 'bank' && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Nomor Rekening</span>
                        <div className="flex items-center">
                          <span className="font-mono">{selectedPaymentMethod.accountNumber}</span>
                          <button 
                            onClick={() => copyToClipboard(selectedPaymentMethod.accountNumber)}
                            className="ml-2 text-primary-600 hover:text-primary-700"
                          >
                            <DocumentDuplicateIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Nama Penerima</span>
                        <span className="font-semibold">{selectedPaymentMethod.accountName}</span>
                      </div>
                    </>
                  )}
                  
                  {selectedPaymentMethod.type === 'qris' && (
                    <div className="text-center">
                      <img 
                        src={selectedPaymentMethod.qrCode} 
                        alt="QR Code" 
                        className="w-48 h-48 mx-auto mb-2"
                      />
                      <p className="text-sm text-gray-600">Scan QR Code untuk melakukan pembayaran</p>
                    </div>
                  )}
                  
                  {selectedPaymentMethod.type === 'ewallet' && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Nomor {selectedPaymentMethod.name}</span>
                      <div className="flex items-center">
                        <span className="font-mono">{selectedPaymentMethod.accountNumber}</span>
                        <button 
                          onClick={() => copyToClipboard(selectedPaymentMethod.accountNumber)}
                          className="ml-2 text-primary-600 hover:text-primary-700"
                        >
                          <DocumentDuplicateIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="p-4 bg-blue-50 rounded-lg mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Cara Pembayaran:</h3>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Transfer sesuai nominal yang tertera</li>
                <li>2. Simpan bukti transfer</li>
                <li>3. Klik tombol &quot;Konfirmasi Pembayaran&quot;</li>
                <li>4. Tunggu verifikasi dari admin (maks 1x24 jam)</li>
              </ol>
            </div>

            <button
              onClick={handlePayment}
              disabled={submitting || !selectedMethod}
              className="btn-primary w-full"
            >
              {submitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses...
                </div>
              ) : (
                'Konfirmasi Pembayaran'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;