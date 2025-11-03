const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const dotenv = require("dotenv");

dotenv.config();

passport.use(
    new JwtStrategy(
        {
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        },
        async (payload, done) => {
            try {
                const user = payload
                if (!user) return done(null, false);
                return done(null, user);
            } catch (err) {
                return done(err, false);
            }
        }
    )
);

module.exports = passport;
