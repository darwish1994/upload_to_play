import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import TextField from '../components/ui/TextField';
import Button from '../components/ui/Button';
import { Lock, Smartphone } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        navigate('/dashboard');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      navigate('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('admin.test@example.com');
    setPassword('123123');
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: 'admin.test@example.com',
        password: '123123',
      });

      if (error) throw error;

      navigate('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-blue-100 mb-4">
            <Smartphone className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Welcome to AppSubmit
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to manage your app submissions
          </p>
        </div>
        
        {/* Login Form */}
        <div className="bg-white py-8 px-6 shadow-xl rounded-lg">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="rounded-md bg-red-50 p-4 border border-red-200">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            
            <TextField
              label="Email Address"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
            
            <TextField
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                <>
                  <Lock size={16} className="mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          {/* Demo Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or try demo</span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleDemoLogin}
                disabled={loading}
              >
                Demo Login (Admin)
              </Button>
            </div>

            <div className="mt-4 text-center">
              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                <p className="font-medium mb-1">Demo Credentials:</p>
                <p>Email: admin.test@example.com</p>
                <p>Password: 123123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;