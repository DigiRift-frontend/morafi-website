# Dockerfile für Morafi - Biuro Rachunkowe
# Statische Website mit Nginx

FROM nginx:alpine

# Standard-Konfiguration entfernen
RUN rm -rf /etc/nginx/conf.d/*
RUN rm -rf /usr/share/nginx/html/*

# Nginx Konfiguration kopieren
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Website-Dateien kopieren
COPY index.html /usr/share/nginx/html/
COPY polityka-prywatnosci.html /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY images/ /usr/share/nginx/html/images/

# Port 3000 freigeben (Coolify Standard)
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q --spider http://localhost:3000/ || exit 1

# Nginx starten
CMD ["nginx", "-g", "daemon off;"]
