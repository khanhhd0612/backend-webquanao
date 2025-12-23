const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const dotenv = require("dotenv");
const User = require("../models/user.model");

dotenv.config();

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.headers && req.headers.authorization) {
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.slice(7);
        }
    }
    return token;
};

passport.use(
    new JwtStrategy(
        {
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: cookieExtractor,
        },
        async (payload, done) => {
            try {
                const user = await User.findById(payload.id);
                
                if (!user) return done(null, false);
                return done(null, user);
            } catch (err) {
                return done(err, false);
            }
        }
    )
);

module.exports = passport;
