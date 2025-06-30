import express from "express";
import {
  createProduct,
  deleteProduct,
  displayProduct,
  getAllProducts,
  getProductById,
  getProductForEdit,
  updateProduct,
  getProductByIdForEdit,
  getListRelatedProducts,
  getAllProductsNoLimit,
  getSuggestedKeywords,
} from "../controllers/products";
import { checkAuthClerk } from "../middlewares/CheckAuthClerk";
// import { checkAuth } from "../middlewares/checkAuth";

const router = express.Router();

router.get("/products", getAllProducts);

router.get("/products/all", getAllProductsNoLimit);

router.get("/products/keywords", getSuggestedKeywords);

router.get("/products/:id", getProductById);

router.get("/products/:id/forEdit", getProductByIdForEdit);

router.get("/products/:id/edit", getProductForEdit);

router.post("/products", createProduct);

router.put("/products/:id", updateProduct);

router.post("/products/:id", deleteProduct);

router.post("/products/:id/display", displayProduct);

router.get("/listRelatedProducts", getListRelatedProducts);

export default router;
