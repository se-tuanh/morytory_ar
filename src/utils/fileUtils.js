const MAX_IMAGE_SIZE_MB = 10;
const MAX_VIDEO_SIZE_MB = 50;

export const validateImage = (file) => {
  if (!file) return { valid: false, error: 'No file provided' };
  
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid format. Only JPG/PNG/WebP are accepted.' };
  }
  
  if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
    return { valid: false, error: `File size exceeds ${MAX_IMAGE_SIZE_MB}MB.` };
  }
  
  return { valid: true };
};

export const validateVideo = (file) => {
  if (!file) return { valid: false, error: 'No file provided' };
  
  const validTypes = ['video/mp4', 'video/quicktime'];
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid format. Only MP4/MOV are accepted.' };
  }
  
  if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
    return { valid: false, error: `File size exceeds ${MAX_VIDEO_SIZE_MB}MB.` };
  }
  
  return { valid: true };
};

export const revokePreviewUrl = (url) => {
  if (url) {
    URL.revokeObjectURL(url);
  }
};
