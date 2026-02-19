#!/bin/bash

# Exit on error
set -e

echo "Starting build process for portal-pirates-backend..."

# 1. Build the app
echo "Building the Node.js application..."
npm install
npm run build

# 2. Build the Docker image
# The Dockerfile handles copying the 'dist' folder into the image
echo "Building the Docker image..."
sudo docker build -t portal-pirates-backend .

# 3. Tag and Push to GCP Artifact Registry
GCP_REGISTRY="europe-west2-docker.pkg.dev/ll-winners26lon-181/portal-pirates"
GCP_IMAGE_NAME="$GCP_REGISTRY/portal-pirates-backend"

echo "Configuring docker for GCP..."
# Using access token to avoid sudo/user credential mismatch
gcloud auth print-access-token | sudo docker login -u oauth2accesstoken --password-stdin https://europe-west2-docker.pkg.dev

echo "Tagging image for GCP..."
sudo docker tag portal-pirates-backend:latest "$GCP_IMAGE_NAME:latest"

echo "Pushing image to $GCP_IMAGE_NAME..."
sudo docker push "$GCP_IMAGE_NAME:latest"

# 4. Deploy to Cloud Run
SERVICE_NAME="portal-pirates-backend"
REGION="europe-west2"

echo "Deploying to Cloud Run..."
gcloud run deploy "$SERVICE_NAME" \
  --image "$GCP_IMAGE_NAME:latest" \
  --region "$REGION" \
  --platform managed \
  --allow-unauthenticated \
  --quiet

SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --region "$REGION" --format='value(status.url)')

echo "---------------------------------------------------"
echo "Build, push, and deployment complete!"
echo "New Cloud Run Service URL: $SERVICE_URL"
echo "---------------------------------------------------"
echo "You can run the container locally with:"
echo "sudo docker run -p 8080:8080 portal-pirates-backend"
