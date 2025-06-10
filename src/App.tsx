import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FormProvider } from './context/FormContext';
import AppSubmissionPage from './pages/AppSubmissionPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import PreviewPage from './pages/PreviewPage';
import EditPage from './pages/EditPage';
import LoginPage from './pages/LoginPage';
import UsersPage from './pages/UsersPage';
import Navbar from './components/layout/Navbar';
import { supabase } from './services/supabaseClient';

// Initialize admin user with proper error handling
const initializeAdmin = async () => {
  try {
    // First check if we can connect to Supabase
    const { data: { user }, error: getUserError } = await supabase.auth.getUser();
    
    // Only return if there's a real connection error, not "Auth session missing!"
    if (getUserError && getUserError.message !== 'Auth session missing!') {
      console.error('Error connecting to Supabase:', getUserError);
      return;
    }
    
    // If user is already authenticated, don't create admin
    if (user) {
      return;
    }

    // Check if admin already exists in the users table
    const { data: existingAdmins, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'admin.test@example.com');

    if (checkError) {
      console.error('Error checking for existing admin:', checkError);
      return;
    }

    // If admin already exists, don't create another one
    if (existingAdmins && existingAdmins.length > 0) {
      return;
    }

    // Create admin user with metadata
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'admin.test@example.com',
      password: '123123',
      options: {
        data: {
          name: 'Admin',
          role: 'admin'
        }
      }
    });

    if (signUpError) {
      console.error('Error signing up admin:', signUpError);
      return;
    }

    if (signUpData.user) {
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Unexpected error during admin initialization:', error);
  }
};

function App() {
  useEffect(() => {
    // Only initialize admin in development or if explicitly needed
    if (import.meta.env.DEV) {
      initializeAdmin();
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Login page - no navbar */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected routes with navbar */}
          <Route path="/*" element={
            <RequireAuth>
              <Navbar />
              <main className="pb-12">
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<AdminDashboardPage />} />
                  <Route 
                    path="/new-submission" 
                    element={
                      <FormProvider>
                        <AppSubmissionPage />
                      </FormProvider>
                    } 
                  />
                  <Route 
                    path="/users" 
                    element={
                      <RequireAdminRole>
                        <UsersPage />
                      </RequireAdminRole>
                    } 
                  />
                  <Route path="/preview/:id" element={<PreviewPage />} />
                  <Route path="/edit/:id" element={<EditPage />} />
                </Routes>
              </main>
            </RequireAuth>
          } />
        </Routes>
      </div>
    </Router>
  );
}

// Auth guard component
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        // Don't treat "Auth session missing!" as an error - it just means no user is logged in
        if (error && error.message !== 'Auth session missing!') {
          console.error('Error getting user:', error);
          setIsAuthenticated(false);
          return;
        }

        setIsAuthenticated(!!user);
      } catch (error) {
        console.error('Unexpected error in auth check:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Admin role guard component
const RequireAdminRole: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);

  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data, error } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();
          
          if (error) {
            console.error('Error getting user role:', error);
            setIsAdmin(false);
          } else {
            setIsAdmin(data?.role === 'admin');
          }
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Unexpected error getting user role:', error);
        setIsAdmin(false);
      }
    };

    checkAdminRole();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id)
            .single();
          
          if (error) {
            console.error('Error getting user role:', error);
            setIsAdmin(false);
          } else {
            setIsAdmin(data?.role === 'admin');
          }
        } catch (error) {
          console.error('Unexpected error getting user role:', error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isAdmin === null) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default App;