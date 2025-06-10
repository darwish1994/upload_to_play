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
    const { data: existingAdmin, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'admin.test@example.com')
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error checking for existing admin:', checkError);
      return;
    }

    // If admin already exists, don't create another one
    if (existingAdmin) {
      return;
    }

    // Create admin user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'admin.test@example.com',
      password: '123123',
    });

    if (signUpError) {
      console.error('Error signing up admin:', signUpError);
      return;
    }

    if (signUpData.user) {
      // Create corresponding entry in public.users table
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: signUpData.user.id,
          name: 'Admin',
          email: 'admin.test@example.com',
          role: 'admin'
        });

      if (insertError) {
        console.error('Error creating admin user record:', insertError);
      } else {
        console.log('Admin user created successfully');
      }
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
        <Navbar />
        <main className="pb-12">
          <Routes>
            <Route 
              path="/" 
              element={
                <FormProvider>
                  <AppSubmissionPage />
                </FormProvider>
              } 
            />
            <Route path="/login" element={<LoginPage />} />
            <Route 
              path="/admin" 
              element={
                <RequireAuth>
                  <AdminDashboardPage />
                </RequireAuth>
              } 
            />
            <Route 
              path="/users" 
              element={
                <RequireAuth adminOnly>
                  <UsersPage />
                </RequireAuth>
              } 
            />
            <Route path="/preview/:id" element={<PreviewPage />} />
            <Route path="/edit/:id" element={<EditPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

// Auth guard component
const RequireAuth: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly = false }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Error getting user:', error);
          setIsAuthenticated(false);
          return;
        }

        setIsAuthenticated(!!user);

        if (user) {
          const { data, error: roleError } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();
          
          if (roleError) {
            console.error('Error getting user role:', roleError);
            setIsAdmin(false);
          } else {
            setIsAdmin(data?.role === 'admin');
          }
        }
      } catch (error) {
        console.error('Unexpected error in auth check:', error);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setIsAuthenticated(!!session);
      
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

  if (isAuthenticated === null || (adminOnly && isAdmin === null)) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/admin\" replace />;
  }

  return <>{children}</>;
};

export default App;