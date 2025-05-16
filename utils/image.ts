import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

// Configure services
if (!cloudinary.config().cloud_name) {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Log configuration for debugging
console.log('Cloudinary Config:', {
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key_exists: !!process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret_exists: !!process.env.CLOUDINARY_API_SECRET,
  upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
});

// Note: We're not using the Google AI API for now due to issues with image generation
// Instead, we're using placeholder images from picsum.photos

// Define a type for File-like objects that have arrayBuffer method
type FileWithArrayBuffer = {
  arrayBuffer: () => Promise<ArrayBuffer>;
  [key: string]: unknown;
};

/**
 * Uploads a file or URL to Cloudinary and returns the secure URL
 */
export async function uploadToCloudinary(fileInput: string | FileWithArrayBuffer): Promise<string> {
  try {
    if (typeof fileInput === 'string') {
      // If it's a string (URL or base64), upload directly
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        cloudinary.uploader.upload(fileInput, {
          upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
        }, (error, result) => {
          if (error) reject(error);
          else resolve(result as UploadApiResponse);
        });
      });
      return result.secure_url;
    } else if (fileInput && typeof fileInput === 'object' && 'arrayBuffer' in fileInput) {
      // If it's a File-like object with arrayBuffer method (works in both browser and Node.js)
      const buffer = await fileInput.arrayBuffer();
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        cloudinary.uploader.upload_stream({
          upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
        }, (error, result) => {
          if (error) reject(error);
          else resolve(result as UploadApiResponse);
        }).end(Buffer.from(buffer));
      });
      return result.secure_url;
    }
    throw new Error('Invalid file type. Must be a File-like object or a string (URL or Data URL).');
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error instanceof Error ? error : new Error('Failed to upload to Cloudinary');
  }
}

/**
 * Generates an image using Google's Gemini AI model
 */
export async function generateImageWithAI(prompt: string): Promise<string> {
  try {
    // For now, since we're having issues with the Gemini API for image generation,
    // let's use a placeholder image from a public image service
    console.log('Generating image with prompt:', prompt);

    // Use a placeholder image service with the prompt as a seed
    const seed = encodeURIComponent(prompt.substring(0, 50));
    const placeholderUrl = `https://picsum.photos/seed/${seed}/800/600`;

    // Upload the placeholder image to Cloudinary
    return await uploadToCloudinary(placeholderUrl);
  } catch (error) {
    console.error('Error generating image:', error);
    throw error instanceof Error ? error : new Error('Failed to generate image');
  }
}

/**
 * Generates a GIF using Google's Gemini AI model
 */
export async function generateGifWithAI(prompt: string): Promise<string> {
  try {
    // For now, since we're having issues with the Gemini API for GIF generation,
    // let's use a placeholder GIF from a public image service
    console.log('Generating GIF with prompt:', prompt);

    // Use a placeholder GIF service
    const seed = encodeURIComponent(prompt.substring(0, 50));
    const placeholderUrl = `https://picsum.photos/seed/${seed}/800/600`; // Not actually a GIF, but will work for demo

    // Upload the placeholder image to Cloudinary
    return await uploadToCloudinary(placeholderUrl);
  } catch (error) {
    console.error('Error generating GIF:', error);
    throw error instanceof Error ? error : new Error('Failed to generate GIF');
  }
}
