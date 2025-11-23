import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, Shield, User, Search } from "lucide-react";

const API_URL = "http://localhost:8080";

function AdminUserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getToken = () => localStorage.getItem("token");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const token = getToken();
      if (!token) throw new Error("No authorization token found.");
      const response = await axios.get(`${API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to fetch users. Access denied.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handlePromote = async (userId) => {
    if (!window.confirm("Are you sure you want to make this user an admin?")) return;
    try {
      const token = getToken();
      await axios.post(`${API_URL}/api/users/${userId}/make-admin`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("User promoted to admin!");
      fetchUsers(); 
    } catch (err) {
      alert("Failed to promote user.");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Delete this user? Action cannot be undone.")) return;
    try {
      const token = getToken();
      await axios.delete(`${API_URL}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("User deleted successfully.");
      fetchUsers();
    } catch (err) {
      alert("Failed to delete user.");
    }
  };

  if (loading) return <div className="text-center p-20 text-gray-500">Loading user data...</div>;
  if (error) return <div className="text-center p-20 text-red-600 font-semibold">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
            <p className="text-gray-500 mt-1">Manage user roles and permissions</p>
          </div>
          <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200">
             <span className="text-sm font-medium text-gray-500 px-2">Total Users: {users.length}</span>
          </div>
        </div>
        
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User Info</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{user.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold mr-3">
                             {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                             <div className="text-sm font-medium text-gray-900">{user.name}</div>
                             <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.admin ? (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                          Admin
                        </span>
                      ) : (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">
                          User
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {!user.admin ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handlePromote(user.id)}
                            className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors text-xs font-semibold"
                            title="Promote to Admin"
                          >
                            Promote
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors text-xs font-semibold"
                            title="Delete User"
                          >
                            Delete
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic text-xs">Protected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminUserManagementPage;