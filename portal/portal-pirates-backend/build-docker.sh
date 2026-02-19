#!/bin/bash

# Exit on error
set -e

echo "Starting build process for portal-pirates-backend..."

# 1. Build the app
echo "Building the Node.js application..."
npm install
npm run build

# 2. Build the Docker image with buildx for amd64/linux platform
# This ensures compatibility with Cloud Run on Apple Silicon Macs
echo "Building the Docker image for linux/amd64..."

# 3. Tag and Push to GCP Artifact Registry
GCP_REGISTRY="europe-west2-docker.pkg.dev/ll-winners26lon-181/portal-pirates"
GCP_IMAGE_NAME="$GCP_REGISTRY/portal-pirates-backend"

echo "Configuring docker for GCP..."
# Using access token to avoid sudo/user credential mismatch
gcloud auth print-access-token | sudo docker login -u oauth2accesstoken --password-stdin https://europe-west2-docker.pkg.dev

echo "Building and pushing image to $GCP_IMAGE_NAME..."
sudo docker buildx build \
  --platform linux/amd64 \
  -t "$GCP_IMAGE_NAME:latest" \
  --push \
  .

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
echo "Note: Using buildx for cross-platform builds (linux/amd64 on Apple Silicon)"
echo "To run the container locally, pull from the registry:"
echo "docker run -p 8080:8080 $GCP_IMAGE_NAME:latest"
