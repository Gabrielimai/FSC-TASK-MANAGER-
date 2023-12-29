const mongoose = require("mongoose");

const connectToDatabase = async () => {
    await mongoose
        .connect(
            `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@fsctaskmanagercluster.6a4rdqu.mongodb.net/?retryWrites=true&w=majority`
        )
        .then(() => console.log("Connected to MongoDB!"))
        .catch((err) => {
            console.log(err);
        });
};

module.exports = connectToDatabase;

 
