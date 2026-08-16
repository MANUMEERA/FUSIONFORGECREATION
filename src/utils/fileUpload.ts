import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export interface UploadResult {
  url: string;
  success: boolean;
  storageType: 'supabase' | 'data_url';
  fileName: string;
  error?: string;
}

/**
 * Handles file asset upload for Company Stamp, Authorized Signature, and Brand Logos.
 * Uploads to Supabase Storage if configured and bucket is available,
 * or safely converts to a clean base64 data URL for offline/preview persistence.
 * Zero manual URL typing required!
 */
export async function uploadAgencyAsset(
  file: File,
  folder: 'signatures' | 'stamps' | 'logos' | 'assets' = 'assets'
): Promise<UploadResult> {
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const timestamp = Date.now();
  const filePath = `${folder}/${timestamp}_${cleanName}`;

  if (isSupabaseConfigured) {
    try {
      // Try uploading to 'agency-assets' bucket
      const bucketName = 'agency-assets';
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath);

        if (publicUrlData && publicUrlData.publicUrl) {
          return {
            url: publicUrlData.publicUrl,
            success: true,
            storageType: 'supabase',
            fileName: file.name
          };
        }
      }
    } catch (err: any) {
      console.warn('[Storage] Supabase storage upload skipped or failed, falling back to persistent data URL:', err?.message);
    }
  }

  // Fallback: Convert to Base64 Data URL (ensures 100% reliability with zero configuration needed)
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      resolve({
        url: dataUrl,
        success: true,
        storageType: 'data_url',
        fileName: file.name
      });
    };
    reader.onerror = () => {
      resolve({
        url: '',
        success: false,
        storageType: 'data_url',
        fileName: file.name,
        error: 'Failed to read file asset.'
      });
    };
    reader.readAsDataURL(file);
  });
}
