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

// Initialize admin user
const initializeAdmin = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'admin.test@example.com',
      password: '123123',
    });

    if (!signUpError && signUpData.user) {
      // Set user as verified since we're creating an admin
      const { error: updateError } = await supabase.auth.updateUser({
        email_confirm: true
      });

      if (updateError) {
        console.error('Error confirming admin email:', updateError);
        return;
      }

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
      }
    } else if (signUpError) {
      console.error('Error signing up admin:', signUpError);
    }
  }
};

function App() {
  useEffect(() => {
    initializeAdmin();
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
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);

      if (user) {
        const { data } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();
        
        setIsAdmin(data?.role === 'admin');
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setIsAuthenticated(!!session);
      
      if (session?.user) {
        const { data } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        setIsAdmin(data?.role === 'admin');
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