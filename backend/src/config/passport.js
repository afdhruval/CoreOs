import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userModel from "../model/user.model.js";
import dotenv from "dotenv";

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `http://localhost:5000/auth/google/callback` // FIXED to user requested URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await userModel.findOne({ googleId: profile.id });
        
        if (!user) {
            user = await userModel.findOne({ email: profile.emails[0].value });
            if (user) {
                user.googleId = profile.id;
                user.verified = true; 
                await user.save();
            } else {
                user = await userModel.create({
                    username: profile.displayName.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random() * 1000),
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    verified: true
                });
            }
        }
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userModel.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

export default passport;
