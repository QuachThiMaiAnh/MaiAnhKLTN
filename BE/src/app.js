import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import morgan from "morgan";

config();

import { connectDB } from "./config/db";
import { createProduct } from "./controllers/products";
import { createVariant, removeVariant } from "./controllers/variant";
import routerAddress from "./routers/Address";
import routerOrder from "./routers/Order";
import attributeRouter from "./routers/attribute.router";
import attributeValueRouter from "./routers/attributevalue";
import routerCart from "./routers/cart";
import routerCategory from "./routers/category";
import productRouter from "./routers/product.router";
// import { createUser } from "./controllers/user";
import routerVoucher from "./routers/voucher";

import http from "http"; // Sử dụng http để kết nối Express và Socket.IO
import { setupSocketIO } from "./controllers/socket";
import categoriesRouter from "./routers/Categories";
import collectionRouter from "./routers/Collections";
import logoRouter from "./routers/Logo";
import PaymentRouter from "./routers/PaymentRouter";
import userRouter from "./routers/Users";
import BlogRouter from "./routers/blog";
import commentRouter from "./routers/comment";
import dashboardRouter from "./routers/dashboard";
import sendEmailRouter from "./routers/send-email";
import sliderRouter from "./routers/slider";
import wishlistRouter from "./routers/wishlist";
import NotificationRouter from "./routers/Notification";
import conversationRouter from "./routers/conversation";
import ChatbotRouter from "./routers/chatbot";

const app = express();

// Tạo HTTP server từ app Express
const server = http.createServer(app);

// Khởi tạo Socket.IO và cấu hình CORS thông qua module socket.js
setupSocketIO(server, app);

//Middleware
app.use(express.json());

app.use(cors());

app.use(morgan("dev"));
/// connect DB
connectDB(process.env.DB_URI);
//Router
app.use(cookieParser());

const dbUrl = process.env.DB_URI;

app.get("/", (req, res) => {
  res.send("Hello World!");
});
// ================ tạo địa chỉ  ===========
app.use("/api", routerAddress);
// ================ order ===========
app.use("/api", routerOrder);

//routers
app.use("/api", productRouter);
app.use("/api", attributeRouter);
app.use("/api", attributeValueRouter);
app.use("/api", PaymentRouter);
app.use("/api", routerCategory);
app.use("/api", routerCart);
app.use("/api", routerVoucher);
app.post("/api/products/add", createProduct);
app.post("/api/variant/add", createVariant);
app.delete("/api/variant/:id", removeVariant);
// Sử dụng Router gửi email
app.use("/api", sendEmailRouter);
app.use("/api/sliders", sliderRouter);
app.use("/api/logo", logoRouter);
app.use("/api/blogs", BlogRouter);
app.use("/api/notifications", NotificationRouter);
app.use("/api/users", userRouter);
app.use("/api/comment", commentRouter);
app.use("/api", wishlistRouter);
app.use("/api/dashboard", dashboardRouter);

app.use("/api/conversation", conversationRouter);
app.use("/api/chatbot", ChatbotRouter);

// Khởi động server
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

const port = process.env.PORT;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export const viteNodeApp = app;
