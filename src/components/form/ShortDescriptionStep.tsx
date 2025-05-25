import React from 'react';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';
import { useFormContext } from '../../context/FormContext';

const ShortDescriptionStep: React.FC = () => {
  const { formData, updateFormData, nextStep, prevStep, validateStep, errors } = useFormContext();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep('shortDesc')) {
      nextStep();
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Short Description</h2>
        
        <form onSubmit={handleSubmit}>
          <TextArea
            label="Short Description"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            placeholder="Enter a brief description of your app (max 80 characters)"
            required
            maxLength={80}
            rows={3}
            error={errors.shortDescription}
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

export default ShortDescriptionStep;