import React from 'react';
import FileUpload from '../ui/FileUpload';
import Button from '../ui/Button';
import { useFormContext } from '../../context/FormContext';

const LogoUploadStep: React.FC = () => {
  const { formData, updateFormData, nextStep, prevStep, validateStep, errors } = useFormContext();

  const handleFileChange = (file: File | null) => {
    updateFormData({ logo: file });
  };

  const handlePreviewChange = (preview: string) => {
    updateFormData({ logoPreview: preview });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep('logo')) {
      nextStep();
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Upload App Logo</h2>
        
        <form onSubmit={handleSubmit}>
          <FileUpload
            label="App Logo"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            onPreviewChange={handlePreviewChange}
            preview={formData.logoPreview}
            required
            maxSize={2}
            width={512}
            height={512}
            error={errors.logo}
          />
          
          <div className="mt-6 flex justify-between">
            <Button type="button" variant="outline" onClick={prevStep}>
              Back
            </Button>
            <Button type="submit" variant="primary">
              Next
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogoUploadStep;