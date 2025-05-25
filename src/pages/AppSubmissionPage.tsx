import React from 'react';
import { useFormContext } from '../context/FormContext';
import AppNameStep from '../components/form/AppNameStep';
import PrivacyStep from '../components/form/PrivacyStep';
import ShortDescriptionStep from '../components/form/ShortDescriptionStep';
import LongDescriptionStep from '../components/form/LongDescriptionStep';
import LogoUploadStep from '../components/form/LogoUploadStep';
import ScreenshotsStep from '../components/form/ScreenshotsStep';
import ConfirmationStep from '../components/form/ConfirmationStep';
import StepIndicator from '../components/form/StepIndicator';
import { StepKey } from '../types';

const AppSubmissionPage: React.FC = () => {
  const { currentStep } = useFormContext();
  
  const steps = [
    { key: 'appName' as StepKey, label: 'App Name', isCompleted: currentStep > 0, component: <AppNameStep /> },
    { key: 'privacy' as StepKey, label: 'Privacy', isCompleted: currentStep > 1, component: <PrivacyStep /> },
    { key: 'shortDesc' as StepKey, label: 'Short Description', isCompleted: currentStep > 2, component: <ShortDescriptionStep /> },
    { key: 'longDesc' as StepKey, label: 'Long Description', isCompleted: currentStep > 3, component: <LongDescriptionStep /> },
    { key: 'logo' as StepKey, label: 'Logo', isCompleted: currentStep > 4, component: <LogoUploadStep /> },
    { key: 'screenshots' as StepKey, label: 'Screenshots', isCompleted: currentStep > 5, component: <ScreenshotsStep /> },
    { key: 'confirm' as StepKey, label: 'Confirm', isCompleted: currentStep > 6, component: <ConfirmationStep /> },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">App Submission Form</h1>
        <p className="text-gray-600 text-center max-w-2xl mx-auto">
          Fill out the form below to submit your app information. This is a multi-step form that will guide you through the process.
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <StepIndicator steps={steps} currentStep={currentStep} />
        
        <div className="mt-8">
          {steps[currentStep].component}
        </div>
      </div>
    </div>
  );
};

export default AppSubmissionPage;