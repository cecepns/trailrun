import { useState, useEffect } from 'react';
import axios from 'axios';
import { formatRupiah } from '../../utils/formatRupiah';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  EyeIcon,
  BanknotesIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PhoneIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMethodForm, setShowMethodForm] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [methodFormData, setMethodFormData] = useState({
    name: '',
    type: '',
    description: '',
    accountNumber: '',
    accountName: '',
    qrCode: ''
  });
  
  // Pagination and search state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPayments, setTotalPayments] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [currentPage, searchTerm, statusFilter]);

  // Debounced search effect
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    const timeout = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
    }, 500);
    
    setSearchTimeout(timeout);
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [searchTerm, statusFilter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 20,
        search: searchTerm,
        status: statusFilter
      });
      
      const response = await axios.get(`https://api-inventory.isavralabel.com/api/trailrun/admin/payments?${params}`);
      setPayments(response.data.payments);
      setTotalPages(response.data.pagination.totalPages);
      setTotalPayments(response.data.pagination.totalPayments);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const response = await axios.get('https://api-inventory.isavralabel.com/api/trailrun/admin/payment-methods');
      setPaymentMethods(response.data);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    }
  };

  const handlePaymentStatusUpdate = async (registrationId, status) => {
    try {
      await axios.put(`https://api-inventory.isavralabel.com/api/trailrun/admin/payments/${registrationId}`, {
        status
      });
      fetchPayments();
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const handleMethodSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingMethod) {
        await axios.put(`https://api-inventory.isavralabel.com/api/trailrun/admin/payment-methods/${editingMethod.id}`, methodFormData);
      } else {
        await axios.post('https://api-inventory.isavralabel.com/api/trailrun/admin/payment-methods', methodFormData);
      }
      
      fetchPaymentMethods();
      resetMethodForm();
    } catch (error) {
      console.error('Error saving payment method:', error);
    }
  };

  const handleMethodEdit = (method) => {
    setEditingMethod(method);
    setMethodFormData({
      name: method.name,
      type: method.type,
      description: method.description,
      accountNumber: method.accountNumber || '',
      accountName: method.accountName || '',
      qrCode: method.qrCode || ''
    });
    setShowMethodForm(true);
  };

  const handleMethodDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus metode pembayaran ini?')) {
      try {
        await axios.delete(`https://api-inventory.isavralabel.com/api/trailrun/admin/payment-methods/${id}`);
        fetchPaymentMethods();
      } catch (error) {
        console.error('Error deleting payment method:', error);
      }
    }
  };

  const resetMethodForm = () => {
    setMethodFormData({
      name: '',
      type: '',
      description: '',
      accountNumber: '',
      accountName: '',
      qrCode: ''
    });
    setEditingMethod(null);
    setShowMethodForm(false);
  };

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

  const handleWhatsAppContact = (phoneNumber, userName) => {
    const message = `Halo ${userName}, saya dari admin KebonKito TrailRun ingin menghubungi Anda terkait pembayaran event.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kelola Pembayaran</h1>
            <p className="text-gray-600">Verifikasi pembayaran dan kelola metode pembayaran</p>
          </div>
          <button
            onClick={() => setShowMethodForm(true)}
            className="btn-primary flex items-center"
          >
            <BanknotesIcon className="h-5 w-5 mr-2" />
            Tambah Metode Pembayaran
          </button>
        </div>

        {/* Payment Methods Form Modal */}
        {showMethodForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">
                  {editingMethod ? 'Edit Metode Pembayaran' : 'Tambah Metode Pembayaran'}
                </h2>
                
                <form onSubmit={handleMethodSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Metode
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={methodFormData.name}
                      onChange={(e) => setMethodFormData({...methodFormData, name: e.target.value})}
                      required
                      className="input-field"
                      placeholder="Contoh: BCA, OVO, QRIS"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipe
                    </label>
                    <select
                      name="type"
                      value={methodFormData.type}
                      onChange={(e) => setMethodFormData({...methodFormData, type: e.target.value})}
                      required
                      className="input-field"
                    >
                      <option value="">Pilih Tipe</option>
                      <option value="bank">Bank Transfer</option>
                      <option value="ewallet">E-Wallet</option>
                      <option value="qris">QRIS</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deskripsi
                    </label>
                    <input
                      type="text"
                      name="description"
                      value={methodFormData.description}
                      onChange={(e) => setMethodFormData({...methodFormData, description: e.target.value})}
                      required
                      className="input-field"
                      placeholder="Contoh: Transfer ke rekening BCA"
                    />
                  </div>

                  {(methodFormData.type === 'bank' || methodFormData.type === 'ewallet') && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nomor Rekening/E-Wallet
                        </label>
                        <input
                          type="text"
                          name="accountNumber"
                          value={methodFormData.accountNumber}
                          onChange={(e) => setMethodFormData({...methodFormData, accountNumber: e.target.value})}
                          required
                          className="input-field"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nama Pemilik
                        </label>
                        <input
                          type="text"
                          name="accountName"
                          value={methodFormData.accountName}
                          onChange={(e) => setMethodFormData({...methodFormData, accountName: e.target.value})}
                          required
                          className="input-field"
                        />
                      </div>
                    </>
                  )}

                  {methodFormData.type === 'qris' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        URL QR Code
                      </label>
                      <input
                        type="url"
                        name="qrCode"
                        value={methodFormData.qrCode}
                        onChange={(e) => setMethodFormData({...methodFormData, qrCode: e.target.value})}
                        required
                        className="input-field"
                        placeholder="https://example.com/qr-code.png"
                      />
                    </div>
                  )}

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={resetMethodForm}
                      className="btn-outline"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      {editingMethod ? 'Update' : 'Simpan'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Requests */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Permintaan Pembayaran</h2>
              <div className="text-sm text-gray-600">
                Total: {totalPayments} pembayaran
              </div>
            </div>
            
            {/* Search and Filter */}
            <div className="mb-6 space-y-4">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari nama, email, atau event..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">Semua Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              {payments.map((payment) => (
                <div key={payment.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{payment.user.name}</h3>
                      <p className="text-sm text-gray-600">{payment.event.title}</p>
                      <p className="text-sm text-gray-500">{payment.user.email}</p>
                      {payment.user.phone && (
                        <div className="flex items-center mt-1">
                          <PhoneIcon className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-500">{payment.user.phone}</span>
                          <button
                            onClick={() => handleWhatsAppContact(payment.user.phone, payment.user.name)}
                            className="ml-2 bg-green-500 text-white rounded-md px-2 py-1 text-sm font-medium"
                          >
                            Hubungi WhatsApp
                          </button>
                        </div>
                      )}
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.paymentStatus)}`}>
                      {payment.paymentStatus}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-lg font-bold text-primary-600">
                      {formatRupiah(payment.event.price)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(payment.createdAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  
                  {/* Shirt Size Display */}
                  <div className="mb-3">
                    <div className="flex items-center">
                      <UserIcon className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm font-medium text-gray-700 mr-2">Ukuran Baju:</span>
                      <span className="text-sm text-gray-600">
                        {payment.ukuranBaju ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {payment.ukuranBaju}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">Belum diisi</span>
                        )}
                      </span>
                    </div>
                  </div>
                  
                  {payment.paymentStatus === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePaymentStatusUpdate(payment.id, 'confirmed')}
                        className="flex items-center px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      >
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => handlePaymentStatusUpdate(payment.id, 'cancelled')}
                        className="flex items-center px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                      >
                        <XCircleIcon className="h-4 w-4 mr-1" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
              
              {payments.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-gray-500 text-lg">Tidak ada permintaan pembayaran</div>
                </div>
              )}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Halaman {currentPage} dari {totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeftIcon className="h-4 w-4 mr-1" />
                      Sebelumnya
                    </button>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Selanjutnya
                      <ChevronRightIcon className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Metode Pembayaran</h2>
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{method.name}</h3>
                      <p className="text-sm text-gray-600">{method.description}</p>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-1">
                        {method.type}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleMethodEdit(method)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleMethodDelete(method.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <XCircleIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {method.type !== 'qris' && (
                    <div className="text-sm text-gray-600">
                      <div>{method.accountNumber}</div>
                      <div>{method.accountName}</div>
                    </div>
                  )}
                </div>
              ))}
              
              {paymentMethods.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-gray-500 text-lg">Belum ada metode pembayaran</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;