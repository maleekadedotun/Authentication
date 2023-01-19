const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
// const posts = require("./routes/posts")
const app = express();

// import routes
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");


dotenv.config();

// connect to dataBase
mongoose.connect(process.env.CONNECT_DB, 
    () => console.log("connect to db!")
);
// Middlewear 
app.use(express.json())


// Route middleWear
app.use("/api/user", authRoute);
 app.use("/api/posts", postRoute);


app.listen(2000, () => console.log("Server up and running"));
