import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FormProvider } from '../context/FormContext';
import AppSubmissionPage from './AppSubmissionPage';
import { getSubmissionById, updateSubmission } from '../services/databaseService';
import { FormData } from '../types';

const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [initialFormData, setInitialFormData] = useState<FormData | null>(null);

  useEffect(() => {
    if (id) {
      const submission = getSubmissionById(id);
      if (submission) {
        // Convert base64 URLs back to files for the form
        // Note: This is just setting the preview URLs, not actual files
        // In a real app, you might need a different approach
        const formData: FormData = {
          appNameEn: submission.appNameEn,
          appNameAr: submission.appNameAr,
          privacyLink: submission.privacyLink,
          shortDescription: submission.shortDescription,
          longDescription: submission.longDescription,
          logo: null, // Cannot convert back to File
          logoPreview: submission.logoUrl,
          screenshots: [], // Cannot convert back to File array
          screenshotPreviews: submission.screenshotUrls
        };
        
        setInitialFormData(formData);
      } else {
        navigate('/admin');
      }
      setLoading(false);
    }
  }, [id, navigate]);

  if (loading || !initialFormData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <FormProvider>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Edit App Submission</h1>
          <p className="text-gray-600 text-center">
            Update the information for your app submission.
          </p>
        </div>
        
        <AppSubmissionPage />
      </div>
    </FormProvider>
  );
};

export default EditPage;