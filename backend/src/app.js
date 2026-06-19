import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import authorRequestRoutes from "./routes/authorRequest.routes.js";
import blogRoutes from "./routes/blog.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/author-requests", authorRequestRoutes);

app.use("/api/blogs", blogRoutes);

app.use("/api/auth", authRoutes);


export default app;