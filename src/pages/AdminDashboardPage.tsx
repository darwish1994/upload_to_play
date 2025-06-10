import React, { useEffect, useState } from 'react';
import DataTable from '../components/admin/DataTable';
import { AppSubmission } from '../types';
import { getSubmissions } from '../services/databaseService';
import { RefreshCw, Plus } from 'lucide-react';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

const AdminDashboardPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<AppSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<'admin' | 'writer' | null>(null);
  const [userName, setUserName] = useState<string>('');
  
  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const data = await getSubmissions();
      setSubmissions(data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('name, role')
          .eq('id', user.id)
          .single();
        
        if (data) {
          setUserName(data.name);
          setUserRole(data.role);
        }
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };
  
  useEffect(() => {
    fetchSubmissions();
    fetchUserInfo();
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome back, {userName || 'User'}!
            </h1>
            <p className="text-gray-600 mt-2">
              {userRole === 'admin' 
                ? 'Manage and review all app submissions' 
                : 'View and manage your app submissions'
              }
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Link to="/new-submission">
              <Button
                variant="primary"
                className="flex items-center"
              >
                <Plus size={16} className="mr-2" />
                New Submission
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={fetchSubmissions}
              className="flex items-center"
              disabled={loading}
            >
              <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <LayoutDashboard className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Submissions</p>
              <p className="text-2xl font-bold text-gray-900">{submissions.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Plus className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {submissions.filter(s => {
                  const submissionDate = new Date(s.createdAt);
                  const now = new Date();
                  return submissionDate.getMonth() === now.getMonth() && 
                         submissionDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <RefreshCw className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Recent Activity</p>
              <p className="text-2xl font-bold text-gray-900">
                {submissions.filter(s => {
                  const submissionDate = new Date(s.createdAt);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return submissionDate >= weekAgo;
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {userRole === 'admin' ? 'All App Submissions' : 'Your App Submissions'}
            </h2>
          </div>
          <DataTable submissions={submissions} onRefresh={fetchSubmissions} />
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;