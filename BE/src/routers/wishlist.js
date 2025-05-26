import express from "express";
import {
  addToWishList,
  changeVariant,
  decrease,
  getWishListByUserId,
  increase,
  updateQuantity,
  removeItem,
} from "../controllers/wishlist";

const router = express.Router();

router.get("/wishlist/:id", getWishListByUserId);

router.post("/wishlist", addToWishList);

router.put("/wishlist/increase", increase);

router.put("/wishlist/decrease", decrease);

router.put("/wishlist/update", updateQuantity);

router.put("/wishlist/change-variant", changeVariant);

router.put("/wishlist/remove", removeItem);

export default router;
