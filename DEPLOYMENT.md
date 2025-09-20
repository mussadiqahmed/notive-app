# Notive App Deployment Guide

## Backend Deployment on Render (Free Tier)

### 1. Prepare Backend for Render

1. **Create a GitHub repository** and push your code
2. **Set up PostgreSQL database** on Render (free tier)
3. **Deploy the backend** using the render.yaml configuration

### 2. Render Setup Steps

1. Go to [Render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Use these settings:
   - **Build Command**: `cd Backend && npm install`
   - **Start Command**: `cd Backend && npm start`
   - **Environment**: Node
   - **Plan**: Free

### 3. Environment Variables on Render

Set these environment variables in Render dashboard:

```
NODE_ENV=production
PORT=3000
DB_HOST=<from_database>
DB_PORT=<from_database>
DB_NAME=<from_database>
DB_USER=<from_database>
DB_PASSWORD=<from_database>
JWT_SECRET=<generate_random_string>
OPENAI_API_KEY=<your_openai_key>
```

### 4. Database Setup

1. Create a new PostgreSQL database on Render
2. Note the connection details
3. Update environment variables with database credentials

### 5. Update Frontend Configuration

After getting your Render URL, update the production URL in:
- `Backend/config.js` - Replace the production baseURL with your actual Render URL

## Frontend Deployment on iOS Developer Account

### 1. Prepare for iOS Build

1. **Install EAS CLI**:
   ```bash
   npm install -g @expo/eas-cli
   ```

2. **Login to Expo**:
   ```bash
   eas login
   ```

3. **Configure EAS**:
   ```bash
   eas build:configure
   ```

### 2. Build for iOS

1. **Create production build**:
   ```bash
   eas build --platform ios --profile production
   ```

2. **Submit to App Store**:
   ```bash
   eas submit --platform ios
   ```

### 3. Environment Configuration

Make sure your frontend is configured to use the production backend URL.

## Important Notes

- **Free Tier Limitations**: Render free tier has some limitations (sleeps after inactivity)
- **Database**: Use Render's free PostgreSQL database
- **File Storage**: Consider using cloud storage for file uploads (AWS S3, Cloudinary)
- **Environment Variables**: Keep sensitive keys secure

## Testing

1. Test backend API endpoints after deployment
2. Test frontend with production backend
3. Verify all features work correctly

## Troubleshooting

- Check Render logs for backend issues
- Verify environment variables are set correctly
- Test database connectivity
- Check CORS settings for frontend-backend communication
