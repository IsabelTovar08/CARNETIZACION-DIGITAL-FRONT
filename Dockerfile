
# ---------- build stage ----------
FROM node:18 AS build
WORKDIR /app

RUN apt-get update && apt-get install -y python3 make g++ \
    && rm -rf /var/lib/apt/lists/*


COPY package*.json ./
RUN npm install --legacy-peer-deps


COPY . .


ENV NG_CLI_ANALYTICS=false
ENV NODE_OPTIONS="--max-old-space-size=4096"


ARG NODE_ENV
ARG API_BASE_URL
ENV NODE_ENV=${NODE_ENV}
ENV API_BASE_URL=${API_BASE_URL}


RUN echo "🔧 Inyectando API_BASE_URL=${API_BASE_URL} en env.js..." && \
    sed -i "s|\${API_BASE_URL}|${API_BASE_URL}|g" ./src/assets/env.js && \
    cat ./src/assets/env.js


RUN npx ng build --configuration production --base-href / --deploy-url /

# ---------- serve stage ----------
FROM nginx:1.25
WORKDIR /


COPY --from=build /app/dist/carnetizacion-digital-front/browser/ /usr/share/nginx/html


EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
