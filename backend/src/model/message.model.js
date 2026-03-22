import mongoose from "mongoose";

const messageSchema = await mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "chats",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "ai"],
        required: true
    },
},
    { timestamps: true }
)

const messageModel = mongoose.model("messages",messageSchema)

export default messageModel