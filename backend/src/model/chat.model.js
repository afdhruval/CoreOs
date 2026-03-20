import mongoose, { model } from "mongoose";

const chatSchema = await mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    title: {
        type: String,
        default: "new chat",
        trim: true
    },

},
    { timestamps: true }
)

const chatModel = mongoose.model("chats", chatSchema)

export default chatModel