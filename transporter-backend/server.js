import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

dotenv.config();
connectDB();

const app = express();
const swaggerDocument = YAML.load("./swagger.yaml");

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
