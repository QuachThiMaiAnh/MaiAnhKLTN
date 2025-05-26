// src/controllers/logo.js

import { StatusCodes } from "http-status-codes";
import Logo from "../models/logo";
import fs from "fs";
import cloudinary from "../config/cloudinary";

export const getLogo = async (req, res) => {
  try {
    const logos = await Logo.find({}).sort({ isCurrent: -1 });
    res.json(logos);
  } catch (error) {
    console.error("Error fetching logos:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server Error", error });
  }
};

export const getLogoById = async (req, res) => {
  try {
    const logo = await Logo.findById(req.params.id);
    if (!logo) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Logo not found" });
    }
    res.json(logo);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server Error", error });
  }
};

export const createLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "No file uploaded" });
    }

    let imageUrl;
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'logos',
      });
      imageUrl = result.secure_url;

      fs.unlinkSync(req.file.path);
    } catch (uploadError) {
      console.error("Error uploading image to Cloudinary:", uploadError);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error uploading image to Cloudinary." });
    }

    const newLogo = new Logo({ title: req.body.title, image: imageUrl });
    const savedLogo = await newLogo.save();
    res.status(StatusCodes.CREATED).json(savedLogo);
  } catch (error) {
    console.error("Error creating logo:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server Error", error });
  }
};

export const updateLogo = async (req, res) => {
  try {
    const logo = await Logo.findById(req.params.id);
    if (!logo) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Logo not found" });
    }

    logo.title = req.body.title || logo.title;

    let imageUrl;
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'logos',
        });
        imageUrl = result.secure_url;

        fs.unlinkSync(req.file.path);

        if (logo.image) {
          const publicId = logo.image.split('/').pop().split('.')[0];
          try {
            await cloudinary.uploader.destroy(`logos/${publicId}`);
          } catch (deleteError) {
            console.error("Error deleting old image from Cloudinary:", deleteError);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error deleting old image from Cloudinary." });
          }
        }

        logo.image = imageUrl;
      } catch (uploadError) {
        console.error("Error uploading image to Cloudinary:", uploadError);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error uploading image to Cloudinary." });
      }
    }

    const updatedLogo = await logo.save();
    res.status(StatusCodes.OK).json(updatedLogo);
  } catch (error) {
    console.error("Error updating logo:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server Error", error });
  }
};

export const setCurrentLogo = async (req, res) => {
  try {
    const logoId = req.params.id;
    await Logo.updateMany({}, { isCurrent: false });

    const updatedLogo = await Logo.findByIdAndUpdate(logoId, { isCurrent: true }, { new: true });

    if (!updatedLogo) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Logo not found" });
    }

    res.status(StatusCodes.OK).json(updatedLogo);
  } catch (error) {
    console.error("Error setting current logo:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server Error", error });
  }
};

export const deleteLogo = async (req, res) => {
  try {
    const logo = await Logo.findById(req.params.id);
    if (!logo) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Logo not found" });
    }

    if (logo.image) {
      const publicId = logo.image.split('/').pop().split('.')[0];
      try {
        await cloudinary.uploader.destroy(`logos/${publicId}`);
      } catch (deleteError) {
        console.error("Error deleting image from Cloudinary:", deleteError);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error deleting image from Cloudinary." });
      }
    }

    await Logo.findByIdAndDelete(req.params.id);

    if (logo.isCurrent) {
      const anotherLogo = await Logo.findOne({});
      if (anotherLogo) {
        anotherLogo.isCurrent = true;
        await anotherLogo.save();
      }
    }

    res.json({ message: "Logo deleted successfully" });
  } catch (error) {
    console.error("Error deleting logo:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server Error", error });
  }
};
