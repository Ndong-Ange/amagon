import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';

interface LayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<LayoutProps> = ({ children }) => {
  const { admin, logout } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-amazon-blue-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/admin/dashboard" className="text-white font-bold text-xl">
                Amagon Admin
              </Link>
            </div>
            
            <div className="flex items-center">
              <span className="text-white mr-4">
                Welcome, {admin?.name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-amazon-orange text-white px-4 py-2 rounded hover:bg-amazon-orange-hover"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {children}
    </div>
  );
};

export default AdminLayout;