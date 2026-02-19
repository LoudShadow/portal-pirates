# Simple Dockerfile to serve pre-built files with Nginx
FROM nginx:alpine

# Copy the build output from the local dist folder to the Nginx html directory
COPY dist /usr/share/nginx/html

# Use the template feature of the nginx image to support the $PORT environment variable
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Default port for Cloud Run
ENV PORT 8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
