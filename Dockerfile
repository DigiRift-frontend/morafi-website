# Dockerfile für Morafi - Biuro Rachunkowe
# Statische Website mit Nginx

FROM nginx:alpine

# Nginx Konfiguration kopieren
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Website-Dateien kopieren
COPY index.html /usr/share/nginx/html/
COPY polityka-prywatnosci.html /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY images/ /usr/share/nginx/html/images/

# Port 80 freigeben
EXPOSE 80

# Nginx starten
CMD ["nginx", "-g", "daemon off;"]
