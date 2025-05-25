import React, { useState } from 'react';
import { Eye, Edit, Download, Trash2 } from 'lucide-react';
import { AppSubmission } from '../../types';
import Button from '../ui/Button';
import { downloadImage, deleteSubmission } from '../../services/databaseService';
import { useNavigate } from 'react-router-dom';

interface DataTableProps {
  submissions: AppSubmission[];
  onRefresh: () => void;
}

const DataTable: React.FC<DataTableProps> = ({ submissions, onRefresh }) => {
  const navigate = useNavigate();
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  const handlePreview = (id: string) => {
    navigate(`/preview/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/edit/${id}`);
  };

  const handleDownloadLogo = (logoUrl: string, appName: string) => {
    downloadImage(logoUrl, `${appName}-logo.png`);
  };

  const handleDownloadScreenshot = (screenshotUrl: string, appName: string, index: number) => {
    downloadImage(screenshotUrl, `${appName}-screenshot-${index + 1}.png`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      await deleteSubmission(id);
      onRefresh();
    }
  };

  const toggleExpandRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  if (submissions.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <p className="text-gray-500">No submissions found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                App Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Logo
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {submissions.map((submission) => (
              <React.Fragment key={submission.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{submission.appNameEn}</div>
                    <div className="text-sm text-gray-500" dir="rtl">{submission.appNameAr}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img 
                      src={submission.logoUrl} 
                      alt={`${submission.appNameEn} logo`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(submission.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePreview(submission.id)}
                        className="p-1"
                      >
                        <Eye size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(submission.id)}
                        className="p-1"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadLogo(submission.logoUrl, submission.appNameEn)}
                        className="p-1"
                      >
                        <Download size={16} />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(submission.id)}
                        className="p-1"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleExpandRow(submission.id)}
                    >
                      {expandedRow === submission.id ? 'Hide Details' : 'Show Details'}
                    </Button>
                  </td>
                </tr>
                {expandedRow === submission.id && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">App Details</h4>
                          <p className="text-sm"><span className="font-medium">Privacy Policy:</span> <a href={submission.privacyLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{submission.privacyLink}</a></p>
                          <p className="text-sm mt-2"><span className="font-medium">Short Description:</span> {submission.shortDescription}</p>
                          <p className="text-sm mt-2"><span className="font-medium">Long Description:</span> {submission.longDescription}</p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Screenshots</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {submission.screenshotUrls.map((url, index) => (
                              <div key={index} className="relative group">
                                <img 
                                  src={url} 
                                  alt={`Screenshot ${index + 1}`} 
                                  className="w-full h-auto rounded border"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDownloadScreenshot(url, submission.appNameEn, index)}
                                    className="bg-white"
                                  >
                                    <Download size={16} />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;