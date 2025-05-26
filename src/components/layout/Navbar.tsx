import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Plus, LogOut } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import Button from '../ui/Button';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  
  React.useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };
  
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-blue-600">AppSubmit</h1>
            </Link>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {isAuthenticated && (
                <Link
                  to="/admin"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === '/admin'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <LayoutDashboard size={18} className="mr-1" />
                  Dashboard
                </Link>
              )}
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  location.pathname === '/'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Plus size={18} className="mr-1" />
                New Submission
              </Link>
            </nav>
          </div>
          
          {isAuthenticated && (
            <div className="flex items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center"
              >
                <LogOut size={16} className="mr-1" />
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="sm:hidden border-t border-gray-200">
        <div className="flex">
          {isAuthenticated && (
            <Link
              to="/admin"
              className={`flex-1 py-2 text-center text-sm font-medium ${
                location.pathname === '/admin'
                  ? 'text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-500'
              }`}
            >
              <LayoutDashboard size={18} className="inline-block mr-1" />
              Dashboard
            </Link>
          )}
          <Link
            to="/"
            className={`flex-1 py-2 text-center text-sm font-medium ${
              location.pathname === '/'
                ? 'text-blue-600 border-b-2 border-blue-500'
                : 'text-gray-500'
            }`}
          >
            <Plus size={18} className="inline-block mr-1" />
            New Submission
          </Link>
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="flex-1 py-2 text-center text-sm font-medium text-gray-500"
            >
              <LogOut size={18} className="inline-block mr-1" />
              Sign Out
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;