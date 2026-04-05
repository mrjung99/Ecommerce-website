import axios from "axios";

export const getSignature = async (folder = "products") => {
  const res = await axios.get(
    `http://localhost:3000/api/v1/cloudinary/signature?folder=${folder}`,
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`,
      },
    },
  );
  return res.data;
};
