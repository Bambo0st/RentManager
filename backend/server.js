const path = require('path')
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

if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve()
    app.use(express.static(path.join(__dirname, 'frontend/dist'))); //if u use react app instead of vite , u should replace dist with build\

    // This is if for any of the routes which is not /api/users route
    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html')))
}
else {
    app.get('/', (req, res) => res.send('Server is ready'))
}

app.listen(port, () => {
    console.log(`Server running on ${port}`);
})