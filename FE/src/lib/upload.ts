import axios from "axios";

export const uploadFile = async (file: File) => {
  if (file) {
    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const PRESET_NAME = "uploads";
    const FOLDER_NAME = "Home";
    // const urls = "";
    const api = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    const formData = new FormData();

    formData.append("upload_preset", PRESET_NAME);
    formData.append("folder", FOLDER_NAME);

    formData.append("file", file);

    const { data } = await axios.post(api, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data.secure_url;
  }

  return;
};

export const uploadFileMultiple = async (files: FileList) => {
  if (files) {
    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const PRESET_NAME = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const FOLDER_NAME = "Home";
    const urls = [];
    const api = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    const formData = new FormData();

    formData.append("upload_preset", PRESET_NAME);
    formData.append("folder", FOLDER_NAME);

    for (const file of files) {
      formData.append("file", file);

      const { data } = await axios.post(api, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      urls.push(data.secure_url);
    }

    return urls;
  }

  return;
};

export const UploadFiles = async (product: any) => {
  if (product.image !== "" && typeof product.image !== "string") {
    const imageUpload = await uploadFile(product.image as File);
    product.image = imageUpload;
  }

  for (let i = 0; i < product.variants.length; i++) {
    if (
      product.variants[i].image !== "" &&
      typeof product.variants[i].image !== "string"
    ) {
      const imageUpload = await uploadFile(product.variants[i].image as File);
      product.variants[i].image = imageUpload;
    }
  }

  return product;
};
