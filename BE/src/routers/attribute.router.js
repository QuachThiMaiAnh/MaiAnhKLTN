import express from "express";
import {
  createAttribute,
  deleteAttribute,
  getAllAttribute,
  getAttributeById,
  updateAttribute,
  displayAttribute,
  deleteAttributeReal,
  getAttributeByIdClient,
} from "../controllers/attribute";

const attributeRouter = express.Router();

attributeRouter.get("/attributes", getAllAttribute);
attributeRouter.get("/attributes/:id", getAttributeById);
attributeRouter.get("/attributes/:id/client", getAttributeByIdClient);
attributeRouter.post("/attributes", createAttribute);
attributeRouter.put("/attributes/:id", updateAttribute);
attributeRouter.delete("/attributes/:id", deleteAttribute);
attributeRouter.delete("/attributesReal/:id", deleteAttributeReal);
attributeRouter.post("/attributes/:id/display", displayAttribute);

export default attributeRouter;
