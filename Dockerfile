# ---------- build stage ----------
FROM node:18 AS build
WORKDIR /app

# Instalar dependencias necesarias para compilar (ej. node-sass, sharp, etc.)
RUN apt-get update && apt-get install -y python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

# Copiar manifiestos primero
COPY package*.json ./

# Si NO tienes package-lock.json, usa npm install
# Si SÍ tienes package-lock.json, puedes cambiar a npm ci
RUN npm install --legacy-peer-deps

# Copiar el resto del proyecto
COPY . .

# Variables de entorno
ENV NG_CLI_ANALYTICS=false
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Compilar Angular (ajusta el nombre de tu app según angular.json -> outputPath)
RUN npx ng build --configuration production --base-href / --deploy-url /

# ---------- serve stage ----------
FROM nginx:1.25
# Copiar build de Angular al contenedor Nginx
COPY --from=build /app/dist/carnetizacion-digital-front/browser/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
