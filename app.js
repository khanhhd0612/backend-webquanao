const express = require("express");
require("dotenv").config();
const routes = require("./src/routes/v1");
const { authLimiter } = require('./src/middlewares/rateLimiter');
const config = require('./src/config/config');
const ApiError = require('./src/utils/ApiError');
const { errorConverter, errorHandler } = require('./src/middlewares/error');
const passport = require('./src/config/passport');


const app = express();

app.use(express.json());

app.use(passport.initialize());

app.get("/", (req, res) => {
    res.send("Server is running!");
});

//rate limit
if (config.env === 'production') {
    app.use('/v1/auth', authLimiter);
}

app.use("/v1", routes);

app.use((req, res, next) => {
    next(new ApiError(404, 'Not found'));
});
// convert error to ApiError
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
