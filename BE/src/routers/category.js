import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
  getAllProductWithCategory,
  displayCategory,
} from "../controllers/category";

const routerCategory = express.Router();

routerCategory.get(`/category`, getAllCategory);
routerCategory.get(`/category/:id`, getCategoryById);
routerCategory.get(`/category/:id/product`, getAllProductWithCategory);
routerCategory.post(`/category`, createCategory);
routerCategory.put(`/category/:id`, updateCategory);
routerCategory.delete(`/category/:id`, deleteCategory);
routerCategory.post("/category/:id/display", displayCategory);

export default routerCategory;
