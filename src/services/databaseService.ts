import { AppSubmission, FormData } from '../types';
import { supabase } from './supabaseClient';

// Upload a file to Supabase Storage
const uploadFile = async (file: File, bucket: string, path: string): Promise<string> => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    throw error;
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return publicUrl;
};

// Create a new submission
export const createSubmission = async (formData: FormData): Promise<AppSubmission> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  // Upload logo
  let logoUrl = '';
  if (formData.logo) {
    const logoPath = `${user.id}/${Date.now()}-${formData.logo.name}`;
    logoUrl = await uploadFile(formData.logo, 'app_logos', logoPath);
  }

  // Upload screenshots
  const screenshotUrls: string[] = [];
  for (const screenshot of formData.screenshots) {
    const screenshotPath = `${user.id}/${Date.now()}-${screenshot.name}`;
    const url = await uploadFile(screenshot, 'app_screenshots', screenshotPath);
    screenshotUrls.push(url);
  }

  const { data, error } = await supabase
    .from('app_submissions')
    .insert([
      {
        app_name_en: formData.appNameEn,
        app_name_ar: formData.appNameAr,
        privacy_link: formData.privacyLink,
        short_description: formData.shortDescription,
        long_description: formData.longDescription,
        logo_url: logoUrl,
        screenshot_urls: screenshotUrls,
        user_id: user.id,
      },
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,
    appNameEn: data.app_name_en,
    appNameAr: data.app_name_ar,
    privacyLink: data.privacy_link,
    shortDescription: data.short_description,
    longDescription: data.long_description,
    logoUrl: data.logo_url,
    screenshotUrls: data.screenshot_urls,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
};

// Get all submissions
export const getSubmissions = async (): Promise<AppSubmission[]> => {
  const { data, error } = await supabase
    .from('app_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data.map((item) => ({
    id: item.id,
    appNameEn: item.app_name_en,
    appNameAr: item.app_name_ar,
    privacyLink: item.privacy_link,
    shortDescription: item.short_description,
    longDescription: item.long_description,
    logoUrl: item.logo_url,
    screenshotUrls: item.screenshot_urls,
    createdAt: new Date(item.created_at),
    updatedAt: new Date(item.updated_at),
  }));
};

// Get a single submission by ID
export const getSubmissionById = async (id: string): Promise<AppSubmission | undefined> => {
  const { data, error } = await supabase
    .from('app_submissions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return undefined;
  }

  return {
    id: data.id,
    appNameEn: data.app_name_en,
    appNameAr: data.app_name_ar,
    privacyLink: data.privacy_link,
    shortDescription: data.short_description,
    longDescription: data.long_description,
    logoUrl: data.logo_url,
    screenshotUrls: data.screenshot_urls,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
};

// Update a submission
export const updateSubmission = async (id: string, formData: FormData): Promise<AppSubmission | undefined> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  // Get existing submission
  const existing = await getSubmissionById(id);
  if (!existing) {
    return undefined;
  }

  // Upload new logo if provided
  let logoUrl = existing.logoUrl;
  if (formData.logo) {
    const logoPath = `${user.id}/${Date.now()}-${formData.logo.name}`;
    logoUrl = await uploadFile(formData.logo, 'app_logos', logoPath);
  }

  // Upload new screenshots if provided
  let screenshotUrls = existing.screenshotUrls;
  if (formData.screenshots.length > 0) {
    screenshotUrls = [];
    for (const screenshot of formData.screenshots) {
      const screenshotPath = `${user.id}/${Date.now()}-${screenshot.name}`;
      const url = await uploadFile(screenshot, 'app_screenshots', screenshotPath);
      screenshotUrls.push(url);
    }
  }

  const { data, error } = await supabase
    .from('app_submissions')
    .update({
      app_name_en: formData.appNameEn,
      app_name_ar: formData.appNameAr,
      privacy_link: formData.privacyLink,
      short_description: formData.shortDescription,
      long_description: formData.longDescription,
      logo_url: logoUrl,
      screenshot_urls: screenshotUrls,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return undefined;
  }

  return {
    id: data.id,
    appNameEn: data.app_name_en,
    appNameAr: data.app_name_ar,
    privacyLink: data.privacy_link,
    shortDescription: data.short_description,
    longDescription: data.long_description,
    logoUrl: data.logo_url,
    screenshotUrls: data.screenshot_urls,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
};

// Delete a submission
export const deleteSubmission = async (id: string): Promise<boolean> => {
  // Get the submission first to get file paths
  const submission = await getSubmissionById(id);
  if (!submission) {
    return false;
  }

  // Delete the submission from the database
  const { error } = await supabase
    .from('app_submissions')
    .delete()
    .eq('id', id);

  if (error) {
    return false;
  }

  // Delete associated files from storage
  // Note: We don't throw if file deletion fails as the submission is already deleted
  try {
    // Delete logo
    const logoPath = submission.logoUrl.split('/').pop();
    if (logoPath) {
      await supabase.storage.from('app_logos').remove([logoPath]);
    }

    // Delete screenshots
    const screenshotPaths = submission.screenshotUrls.map(url => url.split('/').pop()).filter(Boolean);
    if (screenshotPaths.length > 0) {
      await supabase.storage.from('app_screenshots').remove(screenshotPaths);
    }
  } catch (error) {
    console.error('Error deleting files:', error);
  }

  return true;
};

// Download image
export const downloadImage = async (url: string, fileName: string): Promise<void> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(objectUrl);
  } catch (error) {
    console.error('Error downloading image:', error);
    throw error;
  }
};