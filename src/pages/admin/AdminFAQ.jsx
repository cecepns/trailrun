import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

const AdminFAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [openItems, setOpenItems] = useState({});
  const [formData, setFormData] = useState({
    question: '',
    answer: ''
  });

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const response = await axios.get('https://api-inventory.isavralabel.com/api/trailrun/admin/faqs');
      setFaqs(response.data);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingFaq) {
        await axios.put(`https://api-inventory.isavralabel.com/api/trailrun/admin/faqs/${editingFaq.id}`, formData);
      } else {
        await axios.post('https://api-inventory.isavralabel.com/api/trailrun/admin/faqs', formData);
      }
      
      fetchFaqs();
      resetForm();
    } catch (error) {
      console.error('Error saving FAQ:', error);
    }
  };

  const handleEdit = (faq) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus FAQ ini?')) {
      try {
        await axios.delete(`https://api-inventory.isavralabel.com/api/trailrun/admin/faqs/${id}`);
        fetchFaqs();
      } catch (error) {
        console.error('Error deleting FAQ:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      question: '',
      answer: ''
    });
    setEditingFaq(null);
    setShowForm(false);
  };

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kelola FAQ</h1>
            <p className="text-gray-600">Tambah, edit, dan hapus frequently asked questions</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Tambah FAQ
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">
                  {editingFaq ? 'Edit FAQ' : 'Tambah FAQ Baru'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pertanyaan
                    </label>
                    <input
                      type="text"
                      name="question"
                      value={formData.question}
                      onChange={(e) => setFormData({...formData, question: e.target.value})}
                      required
                      className="input-field"
                      placeholder="Masukkan pertanyaan..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Jawaban
                    </label>
                    <textarea
                      name="answer"
                      value={formData.answer}
                      onChange={(e) => setFormData({...formData, answer: e.target.value})}
                      required
                      rows={6}
                      className="input-field"
                      placeholder="Masukkan jawaban..."
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
                      {editingFaq ? 'Update' : 'Simpan'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* FAQ List */}
        <div className="card">
          {faqs.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 text-lg">Belum ada FAQ yang dibuat</div>
              <p className="text-gray-400 mt-2">Klik tombol "Tambah FAQ" untuk membuat FAQ baru</p>
            </div>
          ) : (
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.id} className="border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between p-4">
                    <button
                      onClick={() => toggleItem(faq.id)}
                      className="flex-1 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 pr-4">
                          {faq.question}
                        </h3>
                        {openItems[faq.id] ? (
                          <ChevronUpIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        ) : (
                          <ChevronDownIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(faq)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(faq.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {openItems[faq.id] && (
                    <div className="px-4 pb-4">
                      <div className="pt-2 border-t border-gray-200">
                        <p className="text-gray-600 whitespace-pre-wrap">{faq.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminFAQ;