require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const router = require('./routes/route');


app.use(express.json());

app.use("/api", router);



mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true })
    .then(() => console.log(`MongoDB Connection Successful`))
    .catch((err) => console.log(err));


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Express App running on port ${port}`);
})