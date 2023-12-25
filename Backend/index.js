const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const UserRouter = require("./Routes/userRoutes");
const ProductRouter = require("./Routes/productRoutes");
const SaleRouter = require("./Routes/saleRoutes");
const reportsRouter = require("./Controllers/reports");

try {
   mongoose.connect("mongodb://127.0.0.1:27017/businessDatabase");
} catch (error) {
   console.error(`Ha ocurrido un ${error.name}, con el mensaje:\n${error.message}`);
}

app.use(cors({origin: "http://localhost:5173"}));
app.use("/images", express.static("images"));
app.use(express.json());
app.use("/reports", reportsRouter);
app.use("/users", UserRouter);
app.use("/products", ProductRouter);
app.use("/sales", SaleRouter);

app.listen(3001);