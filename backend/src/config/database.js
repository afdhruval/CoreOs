import mongoose from "mongoose";

function connectTOdb() {
    mongoose.connect(process.env.MONGO_URI)
        .then((res) => {
            console.log("database connected");
        })
}

export default connectTOdb