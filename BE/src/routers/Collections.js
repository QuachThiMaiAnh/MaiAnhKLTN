import { Router } from 'express';
import { createCollection, deleteCollection, getCollectionDetail, getCollections, updateCollection } from '../controllers/collections';

const collectionRouter = Router();

collectionRouter.get('/', getCollections);
collectionRouter.get('/:id', getCollectionDetail);
collectionRouter.post('/', createCollection);
collectionRouter.put('/:id', updateCollection);
collectionRouter.delete('/:id', deleteCollection);

export default collectionRouter;