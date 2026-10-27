# Production Dockerfile for Frontend (Vanilla HTML / CSS / JS)
FROM nginx:1.27-alpine

# Custom Nginx config (SPA routing + API proxy)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Static assets - no build step needed!
COPY index.html style.css app.js /usr/share/nginx/html/
COPY public/ /usr/share/nginx/html/public/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
