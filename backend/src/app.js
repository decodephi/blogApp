import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import authorRequestRoutes from "./routes/authorRequest.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import adminRoutes from "./routes/admin.routes.js";

import bookmarkRoutes from "./routes/bookmark.routes.js";
import likeRoutes from "./routes/like.routes.js";

import dashboardRoutes from "./routes/dashboard.routes.js";

import commentRoutes from "./routes/comment.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/comments", commentRoutes);

app.use("/api/dashboard", dashboardRoutes);


app.use("/api/bookmarks", bookmarkRoutes);

app.use("/api/likes", likeRoutes);

app.use("/api/author-requests", authorRequestRoutes);

app.use("/api/blogs", blogRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/auth", authRoutes);


export default app;