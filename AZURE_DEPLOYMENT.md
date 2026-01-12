# Azure Web App Configuration

## Required GitHub Secrets

To deploy this Flask app to Azure Web App, you need to set up the following secrets in your GitHub repository:

### 1. AZURE_WEBAPP_NAME
- Your Azure Web App name (e.g., "azhartaskapp")

### 2. AZURE_WEBAPP_PUBLISH_PROFILE
- Download publish profile from Azure Portal:
  1. Go to Azure Portal
  2. Navigate to your Web App
  3. Click "Get publish profile" 
  4. Copy the entire XML content
  5. Add as GitHub secret

### 3. AZURE_RESOURCE_GROUP
- Your Azure Resource Group name

### 4. AZURE_CREDENTIALS (Optional - for restart functionality)
- Service Principal credentials in JSON format:
```json
{
  "clientId": "your-client-id",
  "clientSecret": "your-client-secret", 
  "subscriptionId": "your-subscription-id",
  "tenantId": "your-tenant-id"
}
```

## Azure Web App Settings

Configure these application settings in Azure Portal:

### Application Settings
- `SCM_DO_BUILD_DURING_DEPLOYMENT`: true
- `PYTHON_VERSION`: 3.12
- `STARTUP_FILE`: startup.py

### Runtime Stack
- Python 3.12

## Manual Deployment Steps

1. **Create Azure Web App:**
   ```bash
   az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name azhartaskapp --runtime "PYTHON:3.12"
   ```

2. **Set up GitHub Secrets:**
   - Go to your GitHub repository
   - Settings → Secrets and Variables → Actions
   - Add the required secrets listed above

3. **Push to main branch:**
   ```bash
   git add .
   git commit -m "Add Azure deployment workflow"
   git push
   ```

## Local Testing with Gunicorn

Test the production setup locally:
```bash
pip install gunicorn
gunicorn --bind 0.0.0.0:8000 app:app
```

## Troubleshooting

- Check Azure Web App logs in Azure Portal
- Verify all GitHub secrets are set correctly
- Ensure your Azure Web App is configured for Python 3.12
- Check that startup.py is set as the startup file