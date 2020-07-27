const twilio = require('twilio');
const config = require('../config/config');

const AccessToken = twilio.jwt.AccessToken;
const ChatGrant = AccessToken.ChatGrant;
const VideoGrant = AccessToken.VideoGrant;

function ChatTokenGenerator(identity, deviceId) {
  const appName = 'TwilioChat';

  const endpointId = appName + ':' + identity + ':' + deviceId;

  const chatGrant = new ChatGrant({
    serviceSid: config.twilio.TWILIO_CHAT_SERVICE_SID,
    endpointId: endpointId,
  });

  const token = new AccessToken(
    config.twilio.TWILIO_ACCOUNT_SID,
    config.twilio.TWILIO_API_KEY,
    config.twilio.TWILIO_API_SECRET
  );

  token.addGrant(chatGrant);
  token.identity = identity;

  return token.toJwt()
}

function VideoTokenGenerator(identity, roomId) {
  const videoGrant = new VideoGrant({
    room: roomId
  });

  const token = new AccessToken(
    config.twilio.TWILIO_ACCOUNT_SID,
    config.twilio.TWILIO_API_KEY,
    config.twilio.TWILIO_API_SECRET
  );

  token.addGrant(videoGrant)
  token.identity = identity
  return token.toJwt()
}

module.exports = { generateChatToken: ChatTokenGenerator, generateVideoToken: VideoTokenGenerator };