import React from 'react';
import FileUpload from '../ui/FileUpload';
import Button from '../ui/Button';
import { useFormContext } from '../../context/FormContext';

const ScreenshotsStep: React.FC = () => {
  const { formData, updateFormData, nextStep, prevStep, validateStep, errors } = useFormContext();

  const handleFilesChange = (files: File[]) => {
    updateFormData({ screenshots: files });
  };

  const handlePreviewsChange = (previews: string[]) => {
    updateFormData({ screenshotPreviews: previews });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep('screenshots')) {
      nextStep();
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Upload App Screenshots</h2>
        
        <form onSubmit={handleSubmit}>
          <FileUpload
            label="App Screenshots"
            accept="image/png, image/jpeg"
            onChange={() => {}}
            onPreviewChange={() => {}}
            required
            maxSize={5}
            multiple
            onMultipleChange={handleFilesChange}
            onMultiplePreviewChange={handlePreviewsChange}
            previews={formData.screenshotPreviews}
            error={errors.screenshots}
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

export default ScreenshotsStep;