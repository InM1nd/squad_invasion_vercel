# Super Admin Setup Guide

This guide explains how to create a super admin user for the application.

## Prerequisites

- Node.js installed
- Access to Supabase project
- `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`

## Step 1: Add Credentials to .env.local

Add the following variables to your `.env.local` file:

```env
SUPER_ADMIN_EMAIL=admin@example.com
SUPER_ADMIN_PASSWORD=your-secure-password-here
SUPER_ADMIN_USERNAME=superadmin
```

**Important:** 
- Use a strong, unique password
- Keep these credentials secure
- Do not commit `.env.local` to version control

## Step 2: Install Dependencies

If you haven't already, install the required dependencies:

```bash
npm install tsx dotenv
```

## Step 3: Run the Script

Execute the super admin creation script:

```bash
npx tsx scripts/create-super-admin.ts
```

The script will:
1. Check if a user with the specified email already exists
2. Create or update the user in Supabase Auth
3. Create or update the user in the `users` table with `super_admin` role
4. Display the login credentials

## Step 4: Verify

1. Log in to the application using the credentials you set
2. Navigate to the dashboard
3. You should see an "Administration" section in the sidebar with:
   - Users
   - Events
   - System

## Troubleshooting

### Error: Missing environment variables
- Ensure all required variables are set in `.env.local`
- Restart your development server after adding variables

### Error: User already exists
- The script will update the existing user to super_admin role
- If you want to create a new admin, use a different email

### Error: RLS policy violation
- The script uses service role key to bypass RLS
- Ensure `SUPABASE_SERVICE_ROLE_KEY` is correctly set

## Security Notes

- Super admin has full access to all system functions
- Only create super admin accounts for trusted administrators
- Regularly review and audit super admin accounts
- Consider implementing 2FA for super admin accounts in the future

## Admin Features

Once logged in as super admin, you have access to:

### Users Management (`/dashboard/admin/users`)
- View all users
- Search users by email, username, or name
- View user roles and status
- Edit user information (coming soon)
- Ban/unban users (coming soon)

### Events Management (`/dashboard/admin/events`)
- Create and manage events (coming soon)
- View event registrations (coming soon)
- Manage event teams (coming soon)

### System Settings (`/dashboard/admin/system`)
- System configuration (coming soon)
- Database management (coming soon)
- Logs and monitoring (coming soon)

