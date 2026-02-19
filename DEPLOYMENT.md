# Portal Pirates Backend — Configuration Guide

## Local Development (Password via Auth Proxy)

### Prerequisites
- Node.js 22+
- [Cloud SQL Auth Proxy](https://cloud.google.com/sql/docs/postgres/sql-proxy)
- GCP project access: `gcloud auth login`

### 1. Configure `.env`
```bash
PORT=3001
GOOGLE_CLOUD_PROJECT=ll-winners26lon-181
GOOGLE_CLOUD_LOCATION=us-central1
# Password special chars URL-encoded: ( = %28, } = %7D, ? = %3F
DATABASE_URL=postgresql://postgres:YOUR_ENCODED_PASSWORD@localhost:5432/portal_pirates
```
> Leave `CLOUD_SQL_INSTANCE` unset locally — the app detects this and uses `DATABASE_URL` with password auth.

### 2. Start the Cloud SQL Auth Proxy (dedicated terminal)
```bash
cloud-sql-proxy ll-winners26lon-181:europe-west2:portal-pirates-postgres-db
```

### 3. Run the Backend
```bash
cd portal/portal-pirates-backend
npm install
npm run dev
```

### Useful Commands
```bash
npm run db:generate   # Generate SQL from schema.ts changes
npm run db:migrate    # Apply migrations (via Auth Proxy)
npm run db:seed       # Insert mock data
npm run db:studio     # Visual DB browser
```

---

## Cloud Deployment — Passwordless IAM Auth

The backend uses `@google-cloud/cloud-sql-connector` in production. No password is ever stored or transmitted — authentication is handled by GCP IAM using your service account identity.

### 1. Enable Required APIs
```bash
gcloud services enable sqladmin.googleapis.com run.googleapis.com \
  artifactregistry.googleapis.com aiplatform.googleapis.com \
  --project=ll-winners26lon-181
```

### 2. Create an IAM Database User in Cloud SQL
```bash
# Create an IAM user (uses the Cloud Run service account identity)
gcloud sql users create SERVICE_ACCOUNT_EMAIL \
  --instance=portal-pirates-postgres-db \
  --type=cloud_iam_service_account \
  --project=ll-winners26lon-181
```
> Replace `SERVICE_ACCOUNT_EMAIL` with your Cloud Run service account, e.g.:
> `PROJECT_NUMBER-compute@developer.gserviceaccount.com`

### 3. Grant IAM Roles to the Service Account
```bash
PROJECT_NUMBER=$(gcloud projects describe ll-winners26lon-181 --format='value(projectNumber)')
SA="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"

gcloud projects add-iam-policy-binding ll-winners26lon-181 \
  --member="serviceAccount:${SA}" --role="roles/cloudsql.client"

gcloud projects add-iam-policy-binding ll-winners26lon-181 \
  --member="serviceAccount:${SA}" --role="roles/aiplatform.user"
```

### 4. Build & Push Docker Image
```bash
cd portal/portal-pirates-backend
docker build -t europe-west2-docker.pkg.dev/ll-winners26lon-181/portal-pirates/backend:latest .
docker push europe-west2-docker.pkg.dev/ll-winners26lon-181/portal-pirates/backend:latest
```

### 5. Deploy to Cloud Run (No Password!)
```bash
gcloud run deploy portal-pirates-backend \
  --image=europe-west2-docker.pkg.dev/ll-winners26lon-181/portal-pirates/backend:latest \
  --region=europe-west2 \
  --platform=managed \
  --allow-unauthenticated \
  --add-cloudsql-instances=ll-winners26lon-181:europe-west2:portal-pirates-postgres-db \
  --set-env-vars="PORT=8080,\
GOOGLE_CLOUD_PROJECT=ll-winners26lon-181,\
GOOGLE_CLOUD_LOCATION=us-central1,\
CLOUD_SQL_INSTANCE=ll-winners26lon-181:europe-west2:portal-pirates-postgres-db,\
CLOUD_SQL_IAM_USER=PROJECT_NUMBER-compute@developer.gserviceaccount.com,\
DB_NAME=portal_pirates"
```

> **Notice**: No `DATABASE_URL` or password in the Cloud Run config. The presence of `CLOUD_SQL_INSTANCE` triggers IAM auth mode in the code.

### 6. Verify
```bash
gcloud run services describe portal-pirates-backend \
  --region=europe-west2 --format='value(status.url)'

curl https://YOUR_URL/api/transactions
```

---

## How Auth Mode is Decided (in code)

```typescript
// client.ts & app.ts
const isCloudRun = !!process.env.CLOUD_SQL_INSTANCE;

if (isCloudRun) {
  // IAM auth — no password, uses GCP service account identity
} else {
  // Local — DATABASE_URL with password via Auth Proxy
}
```

| Environment | Connection Method | Password? |
|---|---|---|
| Local dev | `DATABASE_URL` via Auth Proxy | ✅ Yes (only in local `.env`) |
| Cloud Run | IAM Connector via Unix socket | ❌ No |
