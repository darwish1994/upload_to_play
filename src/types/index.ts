export interface AppSubmission {
  id: string;
  appNameEn: string;
  appNameAr: string;
  privacyLink: string;
  shortDescription: string;
  longDescription: string;
  logoUrl: string;
  screenshotUrls: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FormData {
  appNameEn: string;
  appNameAr: string;
  privacyLink: string;
  shortDescription: string;
  longDescription: string;
  logo: File | null;
  logoPreview: string;
  screenshots: File[];
  screenshotPreviews: string[];
}

export interface FormErrors {
  appNameEn?: string;
  appNameAr?: string;
  privacyLink?: string;
  shortDescription?: string;
  longDescription?: string;
  logo?: string;
  screenshots?: string;
}

export type StepKey = 'appName' | 'privacy' | 'shortDesc' | 'longDesc' | 'logo' | 'screenshots' | 'confirm';

export interface Step {
  key: StepKey;
  label: string;
  isCompleted: boolean;
  component: React.ReactNode;
}