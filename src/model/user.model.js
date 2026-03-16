import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = await mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        reqiured: true,
        minlength: 6
    },
    verified: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    }

)

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.comparepassword = function (candidatepassword){
    return bcrypt.compare(candidatepassword , this.password)
}

const userModel = mongoose.model("users",userSchema)

export default userModel


