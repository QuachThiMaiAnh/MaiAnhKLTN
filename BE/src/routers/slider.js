import { Router } from "express";
import upload from "../config/upload";
import { createSlide, deleteSlide, getAllSlides, getSlideDetail, updateSlide } from "../controllers/slider";

const sliderRouter = Router();

sliderRouter.get("/", getAllSlides);
sliderRouter.get("/:id", getSlideDetail);
sliderRouter.post("/", upload.fields([{ name: "image", maxCount: 1 }, { name: "backgroundImage", maxCount: 1 }]), createSlide); 
sliderRouter.put("/:id", upload.fields([{ name: "image", maxCount: 1 }, { name: "backgroundImage", maxCount: 1 }]), updateSlide);
sliderRouter.delete("/:id", deleteSlide);

export default sliderRouter;
