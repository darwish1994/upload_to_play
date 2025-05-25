import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppSubmission } from '../types';
import { getSubmissionById } from '../services/databaseService';
import Button from '../components/ui/Button';
import { ArrowLeft, Download } from 'lucide-react';
import { downloadImage } from '../services/databaseService';

const PreviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<AppSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeScreenshot, setActiveScreenshot] = useState(0);

  useEffect(() => {
    if (id) {
      const data = getSubmissionById(id);
      if (data) {
        setSubmission(data);
      }
      setLoading(false);
    }
  }, [id]);

  const handleDownloadLogo = () => {
    if (submission) {
      downloadImage(submission.logoUrl, `${submission.appNameEn}-logo.png`);
    }
  };

  const handleDownloadScreenshot = (index: number) => {
    if (submission) {
      downloadImage(
        submission.screenshotUrls[index],
        `${submission.appNameEn}-screenshot-${index + 1}.png`
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-xl text-gray-600">Submission not found</p>
        <Button 
          variant="outline"
          onClick={() => navigate('/admin')}
          className="mt-4"
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate('/admin')}
        className="mb-6 flex items-center"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to Dashboard
      </Button>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="md:flex">
          {/* App Info Section */}
          <div className="md:w-1/3 p-6 bg-gray-50">
            <div className="flex items-center mb-6">
              <div className="relative">
                <img
                  src={submission.logoUrl}
                  alt={submission.appNameEn}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <button
                  onClick={handleDownloadLogo}
                  className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                  title="Download Logo"
                >
                  <Download size={14} />
                </button>
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-bold text-gray-800">{submission.appNameEn}</h1>
                <p className="text-lg" dir="rtl">{submission.appNameAr}</p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-sm uppercase tracking-wide text-gray-500 mb-2">Privacy Policy</h2>
              <a
                href={submission.privacyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm break-words"
              >
                {submission.privacyLink}
              </a>
            </div>

            <div className="mb-6">
              <h2 className="text-sm uppercase tracking-wide text-gray-500 mb-2">Short Description</h2>
              <p className="text-gray-700 text-sm">{submission.shortDescription}</p>
            </div>

            <div>
              <h2 className="text-sm uppercase tracking-wide text-gray-500 mb-2">Long Description</h2>
              <p className="text-gray-700 text-sm">{submission.longDescription}</p>
            </div>
          </div>

          {/* Screenshots Section */}
          <div className="md:w-2/3 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Screenshots</h2>
            
            {submission.screenshotUrls.length > 0 && (
              <>
                <div className="relative mb-4 bg-gray-100 rounded-lg overflow-hidden flex justify-center">
                  <img
                    src={submission.screenshotUrls[activeScreenshot]}
                    alt={`Screenshot ${activeScreenshot + 1}`}
                    className="max-h-96 object-contain"
                  />
                  <button
                    onClick={() => handleDownloadScreenshot(activeScreenshot)}
                    className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                    title="Download Screenshot"
                  >
                    <Download size={16} />
                  </button>
                </div>
                
                <div className="grid grid-cols-5 gap-2">
                  {submission.screenshotUrls.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveScreenshot(index)}
                      className={`border-2 rounded overflow-hidden transition-all ${
                        activeScreenshot === index ? 'border-blue-500 shadow-md' : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={url}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-16 object-cover"
                      />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;