import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FormData, FormErrors, StepKey } from '../types';

interface FormContextType {
  currentStep: number;
  formData: FormData;
  errors: FormErrors;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<FormData>) => void;
  validateStep: (step: StepKey) => boolean;
  resetForm: () => void;
}

const initialFormData: FormData = {
  appNameEn: '',
  appNameAr: '',
  privacyLink: '',
  shortDescription: '',
  longDescription: '',
  logo: null,
  logoPreview: '',
  screenshots: [],
  screenshotPreviews: []
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const validateStep = (step: StepKey): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    switch (step) {
      case 'appName':
        if (!formData.appNameEn.trim()) {
          newErrors.appNameEn = 'App name in English is required';
          isValid = false;
        }
        if (!formData.appNameAr.trim()) {
          newErrors.appNameAr = 'App name in Arabic is required';
          isValid = false;
        }
        break;

      case 'privacy':
        if (!formData.privacyLink.trim()) {
          newErrors.privacyLink = 'Privacy policy link is required';
          isValid = false;
        } else if (!formData.privacyLink.startsWith('http')) {
          newErrors.privacyLink = 'Please enter a valid URL starting with http:// or https://';
          isValid = false;
        }
        break;

      case 'shortDesc':
        if (!formData.shortDescription.trim()) {
          newErrors.shortDescription = 'Short description is required';
          isValid = false;
        } else if (formData.shortDescription.length > 80) {
          newErrors.shortDescription = 'Short description must be 80 characters or less';
          isValid = false;
        }
        break;

      case 'longDesc':
        if (!formData.longDescription.trim()) {
          newErrors.longDescription = 'Long description is required';
          isValid = false;
        } else if (formData.longDescription.length > 300) {
          newErrors.longDescription = 'Long description must be 300 characters or less';
          isValid = false;
        }
        break;

      case 'logo':
        if (!formData.logo) {
          newErrors.logo = 'Logo image is required';
          isValid = false;
        }
        break;

      case 'screenshots':
        if (formData.screenshots.length === 0) {
          newErrors.screenshots = 'At least one screenshot is required';
          isValid = false;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return isValid;
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
    setCurrentStep(0);
  };

  return (
    <FormContext.Provider
      value={{
        currentStep,
        formData,
        errors,
        setCurrentStep,
        nextStep,
        prevStep,
        updateFormData,
        validateStep,
        resetForm
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = (): FormContextType => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};