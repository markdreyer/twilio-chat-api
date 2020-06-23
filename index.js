import express from 'express';
import jwt from 'express-jwt';
import jwks from 'jwks-rsa';
import cors from 'cors'
import dotenv from 'dotenv'
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

import config from './config.js';
import { getAccessToken } from './twilio.js';

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
    res.json({
        token: getAccessToken('mark')
    });
});

app.listen(8080)