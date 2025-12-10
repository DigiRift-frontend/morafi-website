# Dockerfile für Morafi - Biuro Rachunkowe
# Node.js Backend mit Kontaktformular

FROM node:20-alpine

WORKDIR /app

# Package files kopieren
COPY package*.json ./

# Dependencies installieren
RUN npm install --production

# App-Dateien kopieren
COPY server.js ./
COPY public/ ./public/

# Port 3000 freigeben (Coolify Standard)
EXPOSE 3000

# Server starten
CMD ["node", "server.js"]
