import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { prisma } from "./db.js";
import config from "./config.js";
import dotenv from "dotenv";

dotenv.config();

// Serialize user ID into the session
passport.serializeUser((user: any, done) => {
    console.log("serializeUser called with user:", user);
    
    
    const id = user?.id || user?.user?.id;
    
    if (id === undefined || id === null) {
        console.error("FATAL: No user ID found during serialization!");
        return done(new Error("No user ID found during serialization"), null);
    }
    
    done(null, id);
});

// Deserialize user from the session ID
passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// ----------------------------------------
// Local Strategy (Email & Password)
// ----------------------------------------
passport.use(
    new LocalStrategy(
        { usernameField: "email", passwordField: "password" },
        async (email, password, done) => {
            try {
                const user = await prisma.user.findUnique({ where: { email } });
                
                
                if (!user || !user.password) {
                    return done(null, false, { message: "Invalid credentials" });
                }

                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return done(null, false, { message: "Invalid credentials" });
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

// ----------------------------------------
// Google OAuth Strategy
// ----------------------------------------
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: "/api/user/google/callback",
        },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    // Check if user already exists by Google ID
                    let user = await prisma.user.findUnique({
                        where: { googleId: profile.id },
                    });

                    if (user) {
                        return done(null, user);
                    }

                    // Secure Account Linking:
                    // If Google says the email is verified, we can trust it belongs to the same person.
                    const emailObj = profile.emails?.find(e => e.verified === true);
                    const email = emailObj?.value;

                    if (!email) {
                        return done(new Error("No verified email provided by Google"));
                    }

                    user = await prisma.user.findUnique({
                        where: { email },
                    });

                    if (user) {
                        // User exists with this email, link the Google ID safely
                        user = await prisma.user.update({
                            where: { id: user.id },
                            data: { googleId: profile.id },
                        });
                        return done(null, user);
                    }

                    // User does not exist at all, create a new Google-only account
                    user = await prisma.user.create({
                        data: {
                            email,
                            username: profile.displayName,
                            googleId: profile.id,
                        },
                    });

                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

export default passport;
