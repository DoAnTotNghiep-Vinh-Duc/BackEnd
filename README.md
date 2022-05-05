## Getting Started

Before started you must create a .env file at the same level as the src directory:
PORT=
googleClientID =
googleClientSecret =
facebookID =
facebookSecret =
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
REDIS_PORT =
REDIS_HOST =
CONNECT_MONGODB =
ACOUNTSID_TWILIO =
TOKEN_TWILIO =
SERVICESID_TWILIO =
NAMECOMPANY =
COMPANYMAIL =
MAIL =
MAIL_PASSWORD =
MAIL_HOST =
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_BUCKET_NAME=

First, install all dependence:
npm i

# Build project

npm run build

# Start server

pm2 delete all && pm2 start dist/src/index.js && pm2 save
