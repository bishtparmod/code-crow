const Joi = require('@hapi/joi');

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();
// UNCOMMENT DURING UNIT TESTS ONLY
if (process.env.NODE_ENV == 'test') {
  process.env.MONGO_URI = "mongodb://admin:12321Aa@ds151513.mlab.com:51513/codetest"
  process.env.MONGO_PORT = "57256"
  process.env.JWT_SECRET = "secret"

  process.env.TWILIO_ACCOUNT_SID = "ACdc59845547b0dcaeb67e7f7ea13b16c5"
  process.env.TWILIO_CHAT_SERVICE_SID = "IS9faa74bb360a45d89a786414be5daa18"
  process.env.TWILIO_API_KEY = "SK6f9cfc9d413272ec0a65f2fd1b14ab10"
  process.env.TWILIO_API_SECRET = "Ws5hwMSwi0J59cxa2O1Bd5VXyR8fPX0j"

  process.env.GITHUB_CLIENT_ID = "e08b7ba2b0d31ce70bb0"
  process.env.GITHUB_CLIENT_SECRET = "8896be53040916c6f5ba0e90bcf7bbc945835ec7"
  process.env.GITHUB_CALLBACK_URL = "http://localhost:4040/api/auth/github/callback"

  process.env.BITBUCKET_CLIENT_ID = "tsR2BEwkjJLFkJRf8c"
  process.env.BITBUCKET_CLIENT_SECRET = "fahNepgzN9GWWxFxJYjdJxsXztw4c2HC"
  process.env.BITBUCKET_CALLBACK_URL = "http://localhost:4040/api/auth/bitbucket/callback"

  process.env.GITLAB_CLIENT_ID = "7d6a475b66ba68f19d6275dfd5133b729512d4dbbf4e8fc244fd3e12423ba6c3"
  process.env.GITLAB_CLIENT_SECRET = "640a1988f372f842642f0fde57e711458091ab73a610d23a09a4041a98a57e7b"
  process.env.GITLAB_CALLBACK_URL = "http://localhost:4040/api/auth/gitlab/callback"
  process.env.EMAIL_ADDRESS = "code.crow.alt@gmail.com"
  process.env.EMAIL_PASSWORD = "12321AaA"
  process.env.CODE_CROW_EMAIL = "imustafa97@outlook.com"
  process.env.STRIPE_PK = "pk_test_zNzh2o1OkU21yGQAhUW6W0Yp00Z19jXMyA"
  process.env.STRIPE_SK = "sk_test_O1n3tx6OltoKUJHWM4nH5Vde00iSiccll6"
  process.env.S3_BUCKET_VIDEOS = "code-crow-002"
  process.env.S3_BUCKET_NEWS = "code-crow-002"
  process.env.S3_BUCKET_LEGAL_DOCS = "code-crow-legal-docs"
  process.env.AWS_ACCESS_KEY = "AKIAT3UYX7RL5N44LFEU"
  process.env.AWS_ACCESS_SECRET = "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"
  process.env.FFMPEG_PATH = "ffmpeg/bin/ffmpeg.exe"
}

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow('development', 'staging', 'production', 'test')
    .default('development'),
  SERVER_PORT: Joi.number()
    .default(4040),
  MONGOOSE_DEBUG: Joi.boolean()
    .when('NODE_ENV', {
      is: Joi.string().equal('development'),
      then: Joi.boolean().default(true),
      otherwise: Joi.boolean().default(false)
    }),
  JWT_SECRET: Joi.string().required()
    .description('JWT Secret required to sign'),
  MONGO_URI: Joi.string().required()
    .description('Mongo DB host url'),
  MONGO_PORT: Joi.number()
    .default(27017),
  TWILIO_CHAT_SERVICE_SID: Joi.string().required()
    .description("Twilio chat service SID"),
  TWILIO_ACCOUNT_SID: Joi.string().required()
    .description("Twilio account SID"),
  TWILIO_API_KEY: Joi.string().required()
    .description("Twilio account API Key"),
  TWILIO_API_SECRET: Joi.string().required()
    .description("Twilio account API Secret"),
  STRIPE_PK: Joi.string().required()
    .description("Stripe public key"),
  STRIPE_SK: Joi.string().required()
    .description("Stripe Secret Key"),

}).unknown()
  .required();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: process.env.NODE_ENV || envVars.NODE_ENV,
  port: process.env.PORT || envVars.SERVER_PORT,
  mongooseDebug: process.env.MONGOOSE_DEBUG || envVars.MONGOOSE_DEBUG,
  jwtSecret: process.env.JWT_SECRET || envVars.JWT_SECRET,
  frontend: process.env.MEAN_FRONTEND || envVars.MEAN_FRONTEND || 'angular',
  mongo: {
    host: process.env.MONGO_URI || envVars.MONGO,
    port: process.env.MONGO_PORT || envVars.MONGO_PORT
  },
  bitbucket: {
    clientID: process.env.BITBUCKET_CLIENT_ID || envVars.BITBUCKET_CLIENT_ID,
    clientSecret: process.env.BITBUCKET_CLIENT_SECRET || envVars.BITBUCKET_CLIENT_SECRET,
    callbackURL: process.env.BITBUCKET_CALLBACK_URL || envVars.BITBUCKET_CALLBACK_URL,
    accessToken: envVars.BITBUCKET_ACCESS_TOKEN,
  },
  github: {
    clientID: process.env.GITHUB_CLIENT_ID || envVars.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET || envVars.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL || envVars.GITHUB_CALLBACK_URL,
    accessToken: envVars.GITHUB_ACCESS_TOKEN,
  },
  gitlab: {
    clientID: process.env.GITLAB_CLIENT_ID || envVars.GITLAB_CLIENT_ID,
    clientSecret: process.env.GITLAB_CLIENT_SECRET || envVars.GITLAB_CLIENT_SECRET,
    callbackURL: process.env.GITLAB_CALLBACK_URL || envVars.GITLAB_CALLBACK_URL,
    accessToken: envVars.GITLAB_ACCESS_TOKEN,
  },
  twilio: {
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || envVars.TWILIO_ACCOUNT_SID,
    TWILIO_API_KEY: process.env.TWILIO_API_KEY || envVars.TWILIO_API_KEY,
    TWILIO_API_SECRET: process.env.TWILIO_API_SECRET || envVars.TWILIO_API_SECRET,
    TWILIO_CHAT_SERVICE_SID: process.env.TWILIO_CHAT_SERVICE_SID || envVars.TWILIO_CHAT_SERVICE_SID
  },
  stripe: {
    stripe_pk: process.env.STRIPE_PK || envVars.STRIPE_PK,
    stripe_sk: process.env.STRIPE_SK || envVars.STRIPE_SK
  }
};

module.exports = config;
