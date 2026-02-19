# Use Node.js 22 as the base image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy the pre-built files from the dist folder
COPY dist ./dist

# Copy the prompts directory as it's likely needed at runtime
COPY prompts ./prompts

# Expose the port (Cloud Run defaults to 8080)
ENV PORT=8080
ENV GOOGLE_CLOUD_PROJECT=ll-winners26lon-181
ENV GOOGLE_CLOUD_LOCATION=us-central1

EXPOSE 8080

# Start the application
CMD ["node", "dist/app.js"]
