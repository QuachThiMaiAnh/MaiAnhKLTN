import { Router } from "express";
import {
  addToWishlist,
  banUser,
  createUser,
  getAllUsers,
  getUserById,
  getWishlist,
  restoreUser,
  saveUser,
  softDeleteUser,
  unbanUser,
  updateUser,
} from "../controllers/user";
import { checkAuthClerk } from "../middlewares/CheckAuthClerk";

const userRouter = Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:clerkId", getUserById);
userRouter.post("/soft-delete/:clerkId", checkAuthClerk, softDeleteUser);
userRouter.post("/restore/:clerkId", checkAuthClerk, restoreUser);
userRouter.put("/:clerkId", updateUser);
userRouter.post("/save-user", saveUser);
userRouter.post("/create-user", createUser);
userRouter.post("/ban/:clerkId", banUser);
userRouter.post("/unban/:clerkId", unbanUser);

// Wishlist
userRouter.get("/getWishlist/:userId", getWishlist);
userRouter.post("/addToWishList/:userId", addToWishlist);

export default userRouter;
