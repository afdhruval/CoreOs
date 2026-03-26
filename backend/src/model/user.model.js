import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
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
            minlength: 6
            // Not required for Google users
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true // Allows multiple users to have no googleId
        },
        verified: {
            type: Boolean,
            default: false
        },
        otp: {
            type: String,
        },
        otpExpiry: {
            type: Date,
        }
    },
    {
        timestamps: true
    }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password") || !this.password) return;

    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparepassword = function (candidatepassword) {
    if (!this.password) return false;
    return bcrypt.compare(candidatepassword, this.password);
};

const userModel = mongoose.model("users", userSchema);

export default userModel;