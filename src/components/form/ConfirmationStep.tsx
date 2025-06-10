import React, { useState } from 'react';
import Button from '../ui/Button';
import { useFormContext } from '../../context/FormContext';
import { createSubmission } from '../../services/databaseService';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';

const ConfirmationStep: React.FC = () => {
  const { formData, prevStep, resetForm } = useFormContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('Please sign in to submit your application');
        navigate('/login');
        return;
      }

      await createSubmission(formData);
      resetForm();
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while submitting the form');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Confirm Your Information</h2>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-700 mb-2">App Information</h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500">App Name (English)</p>
              <p className="font-medium">{formData.appNameEn}</p>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500">App Name (Arabic)</p>
              <p className="font-medium text-right" dir="rtl">{formData.appNameAr}</p>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500">Privacy Policy</p>
              <a 
                href={formData.privacyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-words"
              >
                {formData.privacyLink}
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700 mb-2">App Description</h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500">Short Description</p>
              <p>{formData.shortDescription}</p>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500">Long Description</p>
              <p className="text-sm">{formData.longDescription}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="font-medium text-gray-700 mb-2">App Logo</h3>
          {formData.logoPreview && (
            <div className="flex justify-center">
              <img 
                src={formData.logoPreview} 
                alt="App Logo" 
                className="w-32 h-32 object-contain border rounded-lg"
              />
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <h3 className="font-medium text-gray-700 mb-2">App Screenshots</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {formData.screenshotPreviews.map((preview, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <img 
                  src={preview} 
                  alt={`Screenshot ${index + 1}`} 
                  className="w-full h-auto"
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-8 flex justify-between">
          <Button type="button" variant="outline" onClick={prevStep}>
            Back
          </Button>
          <Button 
            type="button" 
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationStep;