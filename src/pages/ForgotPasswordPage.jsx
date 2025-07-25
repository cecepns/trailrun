import { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Redirect to WhatsApp with pre-filled message
    const message = `Halo, saya ingin reset password untuk email: ${email}`;
    const whatsappUrl = `https://wa.me/62895619804666?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-navy-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-navy-900">
            <span className="text-primary-600">KebonKito</span>
            <span className="text-secondary-600">TrailRun</span>
          </h1>
          <h2 className="mt-6 text-2xl font-bold text-navy-900">
            Lupa Password
          </h2>
          <p className="mt-2 text-sm text-navy-600">
            Masukkan email Anda untuk reset password
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card">
          {!submitted ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    placeholder="Masukkan email Anda"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex justify-center items-center"
                >
                  {loading ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : null}
                  {loading ? 'Memproses...' : 'Reset Password'}
                </button>
              </div>

              <div className="text-center">
                <Link to="/login" className="text-sm text-primary-600 hover:text-primary-500">
                  Kembali ke halaman login
                </Link>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="text-green-600">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Permintaan Reset Password Terkirim
              </h3>
              <p className="text-sm text-gray-600">
                Kami telah membuka WhatsApp untuk Anda. Silakan hubungi admin untuk reset password.
              </p>
              <div className="pt-4">
                <Link to="/login" className="btn-primary">
                  Kembali ke Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage; 