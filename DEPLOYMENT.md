# Deploying Indian Cotton to Vercel

This guide will help you deploy your fabric e-commerce application on Vercel, a popular platform for frontend and serverless applications.

## Prerequisites

1. A GitHub account
2. A Vercel account (sign up at [vercel.com](https://vercel.com))
3. A PostgreSQL database (Neon, Supabase, Railway, etc.)
4. Your Stripe API keys

## Step 1: Push Your Code to GitHub

1. Create a new GitHub repository
2. Initialize Git in your project folder (if not already done)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. Add your GitHub repository as a remote and push
   ```bash
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```

## Step 2: Connect Your Repository to Vercel

1. Log in to your Vercel account
2. Click "Add New" → "Project"
3. Select your GitHub repository
4. Import the project

## Step 3: Configure Environment Variables

Add the following environment variables in the Vercel project settings:

- `DATABASE_URL`: Your PostgreSQL connection string
- `PGHOST`: Your PostgreSQL host
- `PGUSER`: Your PostgreSQL username
- `PGPASSWORD`: Your PostgreSQL password
- `PGDATABASE`: Your PostgreSQL database name
- `PGPORT`: PostgreSQL port (usually 5432)
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `VITE_STRIPE_PUBLIC_KEY`: Your Stripe publishable key
- `NODE_ENV`: Set to "production"

## Step 4: Deploy

1. Click "Deploy" to start the deployment process
2. Vercel will build and deploy your application
3. Once complete, you'll receive a URL for your deployed application

## Step 5: Set Up Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Click on "Domains"
3. Add your custom domain and follow the verification steps

## Troubleshooting

- If your build fails, check the build logs in Vercel
- Ensure all environment variables are correctly set
- Make sure your database is accessible from Vercel's servers
- Check that all necessary tables are created in your database

## Database Migration

Before deploying, make sure to run database migrations on your production database:

```bash
DATABASE_URL=your_production_database_url npm run db:push
```

## Additional Notes

- Your application uses PostgreSQL for database storage
- Stripe is integrated for payment processing
- The application serves both the React frontend and Express backend
- The Vercel configuration is set up in the `vercel.json` file