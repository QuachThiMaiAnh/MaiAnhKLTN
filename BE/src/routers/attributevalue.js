import express from "express";
import {
  createAttributeValue,
  getAllAttributeValue,
  getAttributeValueByAttributeId,
  getAttributeValueById,
  removeAttributeValue,
  updateAttributeValue,
  displayAttributeValue,
} from "../controllers/attributeValue";

const attributeValueRouter = express.Router();

attributeValueRouter.get("/attributevalue", getAllAttributeValue);
attributeValueRouter.get("/attributevalue/:id", getAttributeValueById);

// VD: Lay tat ca attribute value của attribute
attributeValueRouter.get(
  "/attributevalueByAttributeID/:id",
  getAttributeValueByAttributeId
);
attributeValueRouter.post("/attributevalue/:id", createAttributeValue);
attributeValueRouter.put("/attributevalue/:id", updateAttributeValue);
attributeValueRouter.delete("/attributevalue/:id", removeAttributeValue);
attributeValueRouter.post("/attributevalue/:id/display", displayAttributeValue);

export default attributeValueRouter;
