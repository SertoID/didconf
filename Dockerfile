FROM node:14
ADD . /app
WORKDIR /usr/src/app
RUN npm i @veramo/cli -g
RUN npm i add veramo-plugin-did-config -g
RUN veramo config create
RUN veramo execute didManagerCreate
# RUN veramo execute -m generateDidConfiguration -a "{\"dids\":[\"<did>\"],\"domain\":\"<domain>\"}"
# RUN veramo execute -m verifyWellKnownDidConfiguration -a "{\"domain\": \"<domain>\"}"
