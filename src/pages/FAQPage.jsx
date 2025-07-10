import { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const FAQPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openItems, setOpenItems] = useState({});

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await axios.get('https://api-inventory.isavralabel.com/api/trailrun/faqs');
        setFaqs(response.data);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-navy-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-navy-600">
            Temukan jawaban untuk pertanyaan yang sering diajukan
          </p>
        </div>

        <div className="card">
          {faqs.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-navy-500 text-lg">Belum ada FAQ yang tersedia</div>
            </div>
          ) : (
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.id} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full text-left p-4 hover:bg-navy-50 focus:outline-none focus:bg-navy-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-navy-900 pr-4">
                        {faq.question}
                      </h3>
                      {openItems[faq.id] ? (
                        <ChevronUpIcon className="h-5 w-5 text-navy-500 flex-shrink-0" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5 text-navy-500 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                  
                  {openItems[faq.id] && (
                    <div className="px-4 pb-4">
                      <div className="pt-2 border-t border-navy-200">
                        <p className="text-navy-600 whitespace-pre-wrap">{faq.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-primary-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">
              Tidak menemukan jawaban?
            </h2>
            <p className="text-navy-600 mb-6">
              Hubungi tim support kami untuk mendapatkan bantuan lebih lanjut
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:info@kebonkitotrailrun.com" 
                className="btn-primary"
              >
                Email Support
              </a>
              <a 
                href="https://wa.me/6281234567890" 
                className="btn-outline"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;