import React from 'react';
import TextField from '../ui/TextField';
import Button from '../ui/Button';
import { useFormContext } from '../../context/FormContext';

const AppNameStep: React.FC = () => {
  const { formData, updateFormData, nextStep, validateStep, errors } = useFormContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep('appName')) {
      nextStep();
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Enter App Name</h2>
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="App Name (English)"
            name="appNameEn"
            value={formData.appNameEn}
            onChange={handleChange}
            placeholder="Enter app name in English"
            required
            error={errors.appNameEn}
          />
          
          <TextField
            label="App Name (Arabic)"
            name="appNameAr"
            value={formData.appNameAr}
            onChange={handleChange}
            placeholder="أدخل اسم التطبيق بالعربية"
            required
            dir="rtl"
            error={errors.appNameAr}
          />
          
          <div className="mt-6">
            <Button type="submit" variant="primary" className="w-full">
              Next
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppNameStep;