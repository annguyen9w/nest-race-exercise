FROM node:17-alpine AS development
RUN apk add curl
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install glob rimraf
RUN npm install --only=development
# should mount the project to /usr/src/app

ARG PORT=80
ENV PORT=${PORT}

ARG API_VERSION=80
ENV API_VERSION=${API_VERSION}

EXPOSE ${PORT}
HEALTHCHECK --interval=5s --timeout=5s CMD curl -f http://127.0.0.1:${PORT}/api/v${API_VERSION}/health || exit 1

# #------------------------------------------------------------------------------

# FROM node:17-alpine As build
# WORKDIR /usr/src/app
# COPY package*.json ./
# RUN npm install --only=development
# COPY . .
# RUN npm run build

# #------------------------------------------------------------------------------
# FROM node:17-alpine As production
# RUN apk add dumb-init curl
# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}

# USER node
# WORKDIR /usr/src/app
# COPY package*.json ./
# # RUN npm install --only=production
# RUN npm ci --only=production
# COPY --chown=node:node . .
# COPY --chown=node:node --from=build /usr/src/app/dist ./dist
# CMD ["dumb-init", "node", "dist/main"]

# ARG PORT=80
# ENV PORT=${PORT}

# ARG API_VERSION=80
# ENV API_VERSION=${API_VERSION}

# EXPOSE ${PORT}
# HEALTHCHECK --interval=5s --timeout=5s CMD curl -f http://127.0.0.1:${PORT}/api/v${API_VERSION}/health || exit 1