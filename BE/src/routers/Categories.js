import { Router } from 'express';
import { createCategory, deleteCategory, getCategories, getCategoryDetail, updateCategory } from '../controllers/categories';

const categoriesRouter = Router();

categoriesRouter.get('/', getCategories);
categoriesRouter.get('/:id', getCategoryDetail);
categoriesRouter.post('/', createCategory);
categoriesRouter.put('/:id', updateCategory);
categoriesRouter.delete('/:id', deleteCategory);

export default categoriesRouter;