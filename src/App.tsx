import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FormProvider } from './context/FormContext';
import AppSubmissionPage from './pages/AppSubmissionPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import PreviewPage from './pages/PreviewPage';
import EditPage from './pages/EditPage';
import Navbar from './components/layout/Navbar';

function App() {
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
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/preview/:id" element={<PreviewPage />} />
            <Route path="/edit/:id" element={<EditPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;