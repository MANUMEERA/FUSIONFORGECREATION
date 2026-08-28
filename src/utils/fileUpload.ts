export interface UploadResult {
  url: string;
  success: boolean;
  storageType: 'data_url';
  fileName: string;
  error?: string;
}

export async function uploadAgencyAsset(
  file: File
): Promise<UploadResult> {
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
        error: 'Failed to read file'
      });
    };
    reader.readAsDataURL(file);
  });
}
