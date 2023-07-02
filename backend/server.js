const express = require("express");
const dotenv = require("dotenv")
dotenv.config();
const cookieParser = require("cookie-parser")
const connectDB = require("./config/db")
const port = process.env.PORT || 3000;
const { notFound, errorHandler } = require("./middleware/errorMiddleware")
const userRoutes = require("./routes/userRoutes");

connectDB();
const app = express();

app.use(express.json());

app.use(cookieParser());
app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on ${port}`);
})