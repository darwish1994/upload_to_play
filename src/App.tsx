import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FormProvider } from './context/FormContext';
import AppSubmissionPage from './pages/AppSubmissionPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import PreviewPage from './pages/PreviewPage';
import EditPage from './pages/EditPage';
import LoginPage from './pages/LoginPage';
import Navbar from './components/layout/Navbar';
import { supabase } from './services/supabaseClient';

// Initialize admin user
const initializeAdmin = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    const { error } = await supabase.auth.signUp({
      email: 'admin@gmail.com',
      password: '123123',
    });

    if (!error) {
      // Set user as verified since we're creating an admin
      const { error: updateError } = await supabase.auth.updateUser({
        email_confirm: true
      });

      if (updateError) {
        console.error('Error confirming admin email:', updateError);
      }
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
            <Route path="/preview/:id" element={<PreviewPage />} />
            <Route path="/edit/:id" element={<EditPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

// Auth guard component
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };

    checkAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export default App;