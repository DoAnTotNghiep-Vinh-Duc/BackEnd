## Getting Started

Before started you must create a .env file at the same level as the src directory:
PORT =
NAMECOMPANY =
COMPANYMAIL =
SNS_USER =
SNS_PASSWORD =
SNS_HOST =

First, install all dependence:
npm i

# Build project

npm run build1

# Start server

pm2 delete all && pm2 start dist/src/index.js && pm2 save
