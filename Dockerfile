# Site statique : aucune étape de build. Le dépôt EST le site.
#
# On copie la racine telle quelle plutôt que d'énumérer les fichiers : une
# page ajoutée plus tard serait sinon absente de l'image sans que rien ne le
# signale. Les exclusions sont dans .dockerignore.
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html/

# nginx.conf et .dockerignore n'ont rien à faire dans la racine servie.
RUN rm -f /usr/share/nginx/html/nginx.conf \
          /usr/share/nginx/html/Dockerfile \
          /usr/share/nginx/html/.dockerignore

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
