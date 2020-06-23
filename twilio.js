const twilio = require('twilio')

const getAccessToken = (identity) => {
    const token = new twilio.jwt.AccessToken(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_API_KEY,
        process.env.TWILIO_API_SECRET);

    const chatGrant = new twilio.jwt.AccessToken.ChatGrant({
        serviceSid: process.env.TWILIO_CHAT_SERVICE_SID,
    });
    token.addGrant(chatGrant);
    token.identity = identity;
    return token.toJwt();
}

module.exports = getAccessToken

