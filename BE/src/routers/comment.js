import { Router } from "express";
import {
  createComment,
  getAllComment,
  displayComment,
  deleteComment,
} from "../controllers/comment";

const commentRouter = Router();

commentRouter.post("/", createComment);

commentRouter.put("/:id", displayComment);

commentRouter.delete("/:id", deleteComment);

commentRouter.get("/", getAllComment);
// commentRouter.post("/", upload.single("image"), createSlide);

export default commentRouter;
