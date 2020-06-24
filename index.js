const express = require('express')
const jwt = require('express-jwt')
const jwks = require('jwks-rsa')
const cors = require('cors')
const dotenv = require('dotenv')
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const config = require('./config.js')
const getAccessToken = require('./twilio.js')

const app = express();
app.use(cors())

const authorize = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${config.issuer}.well-known/jwks.json`
    }),

    // Validate the audience and the issuer.
    audience: config.audience,
    issuer: config.issuer,
    algorithms: ['RS256']
});

// This route needs authentication
app.get('/api/private', authorize, function (req, res) {

    if (!req.user.email_verified) return res.sendStatus(401);

    res.json({
        token: getAccessToken(req.user.email)
    });
});

app.listen(8080)