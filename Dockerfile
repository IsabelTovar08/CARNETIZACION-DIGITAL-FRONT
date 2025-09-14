# ---------- build stage ----------
FROM node:18-alpine AS build
WORKDIR /app

# Herramientas para deps nativas (sharp, node-sass, etc.)
RUN apk add --no-cache python3 make g++

# Copiamos manifiestos primero para aprovechar caché
COPY package*.json ./

# Instalación más tolerante a conflictos de peer deps
RUN npm ci --legacy-peer-deps

# Asegurar Angular CLI si no está en devDependencies
# (si ya está, este paso es un no-op)
RUN node -e "const p=require('./package.json'); const v=(p.devDependencies||{})['@angular/cli']; if(!v){process.exit(1)}" || npm i -D @angular/cli@latest

# Copiamos el resto del proyecto
COPY . .

# Flags útiles de build
ENV NG_CLI_ANALYTICS=false
# Memoria para builds grandes; descomenta openssl si ves error 'digital envelope routines'
ENV NODE_OPTIONS="--max-old-space-size=4096"
# ENV NODE_OPTIONS="--max-old-space-size=4096 --openssl-legacy-provider"

# Sanidad mínima
RUN [ -f angular.json ] || (echo 'angular.json no existe en la raíz del contexto' && exit 1)
RUN npx ng version

# Compila para producción sirviendo en raíz (/)
RUN npx ng build --configuration production --base-href / --deploy-url /

# ---------- serve stage ----------
FROM nginx:alpine
# Si tu build genera dist/<app-name>/ AJUSTA la siguiente ruta:
COPY --from=build /app/dist/carnetizacion-digital-front/browser/ /usr/share/nginx/html
  EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
