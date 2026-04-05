import axios from "axios";

export const uploadImageToCloudinary = async (file, sig) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("timestamp", sig.timestamp);
    formData.append("api_key", sig.apiKey);
    formData.append("signature", sig.signature);
    formData.append("folder", sig.folder);

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
      formData,
    );

    const publicId = res.data.public_id;

    const baseUrl = `https://res.cloudinary.com/${sig.cloudName}/image/upload`;

    return {
      publicId,
      originalUrl: res.data.secure_url,
      thumbnail: `${baseUrl}/c_fill,w_300,h_300/${publicId}.jpg`,
      medium: `${baseUrl}/c_fill,w_600,h_600/${publicId}.jpg`,
      large: `${baseUrl}/c_fill,w_1200,h_1200/${publicId}.jpg`,
    };
  } catch (error) {
    console.error("Upload error: ", error.response?.data || error);
    throw error;
  }
};
