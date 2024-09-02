const mongoose = require('mongoose');
require("dotenv").config();
const DB_URL=process.env.DB_URL;
// const DB_URL="mongodb+srv://admin:bvBSmAb6o15AInRw@cluster0.oopo9qg.mongodb.net/myntra-backend";
mongoose.connect(DB_URL)
.then(()=>console.log("DB Connection Established"))
.catch((err)=>{console.log("Error while connecting DB : ",err)});
