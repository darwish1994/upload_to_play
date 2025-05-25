import React from 'react';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';
import { useFormContext } from '../../context/FormContext';

const LongDescriptionStep: React.FC = () => {
  const { formData, updateFormData, nextStep, prevStep, validateStep, errors } = useFormContext();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep('longDesc')) {
      nextStep();
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Long Description</h2>
        
        <form onSubmit={handleSubmit}>
          <TextArea
            label="Long Description"
            name="longDescription"
            value={formData.longDescription}
            onChange={handleChange}
            placeholder="Enter a detailed description of your app (max 300 characters)"
            required
            maxLength={300}
            rows={6}
            error={errors.longDescription}
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

export default LongDescriptionStep;