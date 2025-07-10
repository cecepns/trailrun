import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon,
  CalendarIcon,
  ShieldCheckIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://api-inventory.isavralabel.com/api/trailrun/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(`https://api-inventory.isavralabel.com/api/trailrun/admin/users/${userId}/role`, {
        role: newRole
      });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kelola Users</h1>
          <p className="text-gray-600">Lihat dan kelola user yang terdaftar di sistem</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Cari user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">Semua Role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div key={user.id} className="card">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <UserIcon className="h-6 w-6 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role === 'admin' ? (
                        <ShieldCheckIcon className="h-3 w-3 mr-1" />
                      ) : (
                        <UserGroupIcon className="h-3 w-3 mr-1" />
                      )}
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <span>Bergabung {new Date(user.createdAt).toLocaleDateString('id-ID')}</span>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Role:</span>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                <div className="mt-2 text-sm text-gray-600">
                  <span>Registrasi Event: {user.registrationCount || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              {searchTerm || filterRole !== 'all' ? 'Tidak ada user yang ditemukan' : 'Belum ada user yang terdaftar'}
            </div>
            <p className="text-gray-400 mt-2">
              {searchTerm || filterRole !== 'all' ? 'Coba ubah filter pencarian Anda' : 'User akan muncul di sini setelah melakukan registrasi'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;