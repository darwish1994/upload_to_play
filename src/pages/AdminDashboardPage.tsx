import React, { useEffect, useState } from 'react';
import DataTable from '../components/admin/DataTable';
import { AppSubmission } from '../types';
import { getSubmissions } from '../services/databaseService';
import { RefreshCw } from 'lucide-react';
import Button from '../components/ui/Button';

const AdminDashboardPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<AppSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  
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
  
  useEffect(() => {
    fetchSubmissions();
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">App Submissions</h1>
          <p className="text-gray-600 mt-1">Manage and review all app submissions</p>
        </div>
        <Button
          variant="outline"
          onClick={fetchSubmissions}
          className="mt-4 sm:mt-0 flex items-center"
          disabled={loading}
        >
          <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <DataTable submissions={submissions} onRefresh={fetchSubmissions} />
      )}
    </div>
  );
};

export default AdminDashboardPage;