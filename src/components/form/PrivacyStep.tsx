import React from 'react';
import TextField from '../ui/TextField';
import Button from '../ui/Button';
import { useFormContext } from '../../context/FormContext';

const PrivacyStep: React.FC = () => {
  const { formData, updateFormData, nextStep, prevStep, validateStep, errors } = useFormContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep('privacy')) {
      nextStep();
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Enter Privacy Policy Link</h2>
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Privacy Policy URL"
            name="privacyLink"
            value={formData.privacyLink}
            onChange={handleChange}
            placeholder="https://example.com/privacy"
            type="url"
            required
            error={errors.privacyLink}
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

export default PrivacyStep;