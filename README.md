# 🔐 Authentication Project

A secure and modern authentication system built using **Next.js, TypeScript, Supabase, SQL, and Resend SMTP**.

The project demonstrates multiple authentication methods including Mobile OTP, Email/Password, Email OTP Verification, and Google Sign-In. It also includes protected routes, user profile management, database migrations, Row Level Security, Supabase Storage, and a FOXSCAN-inspired interface.

---

## 📌 Project Overview

Authentication is an essential part of modern web applications. This project implements a complete authentication workflow where users can register or sign in using different authentication methods and access protected application resources only after successful authentication.

The main objective of this project is to understand the **authentication workflow, session management, database integration, security, and OAuth concepts**, rather than only creating a login interface.

### Authentication Flow

```text
                         FOXSCAN APPLICATION
                                  │
                                  ▼
                         Authentication Page
                                  │
                ┌─────────────────┼─────────────────┐
                │                 │                 │
                ▼                 ▼                 ▼
          Mobile + OTP     Email + Password    Google Sign-In
                │                 │                 │
                └─────────────────┼─────────────────┘
                                  │
                                  ▼
                         Supabase Authentication
                                  │
                                  ▼
                            User Session
                                  │
                                  ▼
                              Dashboard
✨ Features
📱 1. Mobile Number + OTP Authentication

Users can authenticate using their mobile number.

Flow
Enter Mobile Number
        ↓
Request OTP
        ↓
OTP sent through SMS Provider
        ↓
Enter OTP
        ↓
Verify OTP
        ↓
Authentication Successful
        ↓
Dashboard

The application uses Supabase Authentication for the OTP verification process.

For Indian users, the phone number is formatted using:

+91XXXXXXXXXX
Note

SMS delivery depends on the configured SMS provider and account status. Test/demo accounts may restrict OTP delivery to registered or approved test numbers.

📧 2. Email + Password Authentication

Existing users can sign in using their email address and password.

Flow
Enter Email
     ↓
Enter Password
     ↓
Supabase Authentication
     ↓
Credentials Valid?
    /       \
  Yes        No
   ↓          ↓
Dashboard   Error Message

The authentication request is handled using Supabase:

supabase.auth.signInWithPassword({
  email,
  password
});
✉️ 3. Email OTP Verification

New users can verify their email address before creating their password.

Signup Flow
Enter Email
     ↓
Send Verification OTP
     ↓
OTP Received by Email
     ↓
Enter OTP
     ↓
Verify OTP
     ↓
Create Password
     ↓
Account Ready
     ↓
Dashboard

The email verification template uses the Supabase OTP token:

{{ .Token }}
🔑 4. Secure Password Creation

After successful email verification, users are redirected to the password creation page.

The password must satisfy the following requirements:

Minimum 8 characters
At least one uppercase letter
At least one lowercase letter
At least one number
At least one special character
Confirm password must match
Password Validation
const hasMinLength = password.length >= 8;
const hasUppercase = /[A-Z]/.test(password);
const hasLowercase = /[a-z]/.test(password);
const hasNumber = /[0-9]/.test(password);
const hasSpecial = /[^A-Za-z0-9]/.test(password);

const isPasswordValid =
  hasMinLength &&
  hasUppercase &&
  hasLowercase &&
  hasNumber &&
  hasSpecial;

The password is securely updated using Supabase:

supabase.auth.updateUser({
  password
});
🔵 5. Google Sign-In

Users can authenticate using their Google account.

Flow
Click "Continue with Google"
             ↓
       Google OAuth
             ↓
       Google Login
             ↓
       Authorization
             ↓
       Supabase Auth
             ↓
          Dashboard

The application uses Supabase OAuth:

supabase.auth.signInWithOAuth({
  provider: "google"
});

Google OAuth is configured using:

Google Cloud Console
Google OAuth Client
Supabase Authentication
Authorized redirect URLs

👤 6. User Profile Management

The project includes a profile setup section for storing user-related information.

The profile database supports:

User ID
Email
Phone
Full Name
Avatar Path
Location
Account Type
Created At
Updated At

Application profile information is stored in a dedicated profiles table instead of directly modifying Supabase's authentication table.

🛡️ 7. Protected Dashboard

The dashboard is accessible only to authenticated users.

The application checks the current Supabase session/user:

const {
  data: { user }
} = await supabase.auth.getUser();
Unauthenticated User
/dashboard
     ↓
Check Authentication
     ↓
No User
     ↓
Redirect to Login
Authenticated User
/dashboard
     ↓
Check Authentication
     ↓
User Found
     ↓
Display Dashboard

This prevents unauthenticated users from accessing protected application content.

🗄️ 8. Supabase PostgreSQL Database

The project uses Supabase PostgreSQL for application data.

The main application table is:

public.profiles
Profile Schema
Column	Type	Description
id	UUID	User ID linked to auth.users
email	TEXT	User email
phone	TEXT	User phone number
full_name	TEXT	User's full name
avatar_path	TEXT	Profile image path
location	TEXT	User location
account_type	TEXT	Account type
created_at	TIMESTAMPTZ	Profile creation time
updated_at	TIMESTAMPTZ	Last update time

The profile ID references:

auth.users(id)

using:

ON DELETE CASCADE
🔒 9. Row Level Security (RLS)

Row Level Security is enabled on the profiles table.

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

Users can access their own profile using:

auth.uid() = id

This provides database-level access control and helps prevent users from accessing another user's profile.

🔄 10. Automatic Profile Creation

A PostgreSQL database trigger automatically creates a profile when a new user is created in auth.users.

Workflow
New User
   ↓
Supabase auth.users
   ↓
Database Trigger
   ↓
handle_new_user()
   ↓
public.profiles

The trigger is:

on_auth_user_created

The database function is:

handle_new_user()

This automatically creates the initial profile record after authentication signup.

🗂️ 11. Supabase Storage

The project includes a private storage bucket for profile pictures:

profile-pictures

Storage policies are configured so authenticated users can work with their own profile pictures.

The storage structure uses the authenticated user's ID to restrict access.

📧 12. Email Architecture

The project uses Supabase Authentication with SMTP configuration through Resend.

Email Flow
User
 ↓
Next.js Application
 ↓
Supabase Authentication
 ↓
SMTP
 ↓
Resend
 ↓
User Email Inbox

The email verification template displays the OTP using:

{{ .Token }}

A verified email domain can be used for production-style email delivery.

🎨 FOXSCAN Design

The authentication interface follows a FOXSCAN-inspired visual direction.

Design Characteristics
Clean white background
FOXSCAN amber
Black typography
Inter Tight typography
Minimal and professional layout
Hairline borders
Structured spacing
Responsive design
FOXSCAN splash screen
Loading screen
Authentication interface
Profile interface
Primary Colors
Color	Hex
Amber	#FFBF1B
Ink	#121212
Body	#5B5B5B
Muted	#8A8A8A
Paper	#FFFFFF
Line	#E6E4DC
📁 Project Structure
authentication-project/
│
├── app/
│   │
│   ├── api/
│   │   └── send/
│   │       └── route.ts
│   │
│   ├── dashboard/
│   │   └── page.tsx
│   │
│   ├── loading/
│   │   └── page.tsx
│   │
│   ├── profile-setup/
│   │   └── page.tsx
│   │
│   ├── set-password/
│   │   └── page.tsx
│   │
│   ├── splash/
│   │   └── page.tsx
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── public/
│   └── foxscan-mark.svg
│
├── supabase/
│   └── migrations/
│       ├── 002_create_profile_trigger.sql
│       └── 003_storage_and_profiles_complete.sql
│
├── utils/
│   └── supabase/
│       └── client.ts
│
├── .gitignore
├── AGENTS.md
├── FoxScan_Design_Direction.md
├── README.md
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
└── tsconfig.json
🛠️ Technologies Used
Frontend
Next.js
React
TypeScript
Tailwind CSS
Authentication
Supabase Authentication
Email OTP
Email/Password
Phone OTP
Google OAuth
Database
Supabase
PostgreSQL
SQL
Row Level Security
Database Triggers
PostgreSQL Functions
Email
Resend
SMTP
Supabase Email Templates
Storage
Supabase Storage
Development Tools
VS Code / Antigravity
Git
GitHub
npm
⚙️ Installation & Setup
1. Clone the Repository
git clone https://github.com/shravaniR14/authentication-project-.git

Then move into the project directory:

cd authentication-project-
2. Install Dependencies
npm install
3. Configure Environment Variables

Create a file named:

.env.local

Add:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
RESEND_API_KEY=your_resend_api_key
Security Warning

Never commit .env.local to GitHub.

Do not expose:

Supabase service-role keys
Resend API keys
OAuth client secrets
Database passwords

Private secrets should never use the NEXT_PUBLIC_ prefix.

🔧 Supabase Configuration

Create a Supabase project and configure the required authentication providers.

Authentication Providers

Enable:

Email
Phone
Google
📱 Phone Authentication Setup

Enable Phone Authentication in Supabase.

Configure the supported SMS provider.

For testing, some SMS providers may restrict OTP delivery to registered or approved test numbers.

📧 Email Authentication Setup

Configure Supabase SMTP using the Resend SMTP credentials.

Use a verified sending domain and configure the required DNS records with the domain provider.

The Supabase email template should contain the OTP token:

<h2>Your verification code</h2>

<p>Use the following OTP to verify your email:</p>

<h1>{{ .Token }}</h1>

<p>This code will expire soon. Do not share this code with anyone.</p>
🔵 Google OAuth Setup

Create a Google OAuth application using Google Cloud Console.

Configure the application as a Web Application.

For local development, configure:

http://localhost:3000

as an authorized JavaScript origin.

Configure the Supabase OAuth callback URL as the authorized redirect URI.

Then add the Google Client ID and Client Secret to the Supabase Google provider configuration.

🗃️ Database Migrations

Database migrations are stored in:

supabase/migrations/

Current migrations:

002_create_profile_trigger.sql
003_storage_and_profiles_complete.sql
Migration 002

Creates:

handle_new_user()

and:

on_auth_user_created

The trigger automatically creates a profile when a new authentication user is created.

Migration 003

Adds additional profile and storage configuration including:

Additional profile columns
Profile INSERT policy
Profile-picture storage bucket
Storage RLS policies
🚀 Running the Application

Start the development server:

npm run dev

Open:

http://localhost:3000
🧪 Testing

The following authentication scenarios should be tested.

Test 1 — Email Login
Valid Email
+
Valid Password
        ↓
Dashboard

Expected result:

Login successful
Test 2 — Invalid Credentials
Invalid Email / Password
        ↓
Error Message

Expected result:

The user remains on the authentication page.

Test 3 — Email Signup
Enter Email
     ↓
Receive OTP
     ↓
Enter OTP
     ↓
Verify Email
     ↓
Create Password
     ↓
Dashboard
Test 4 — Mobile OTP
Enter Mobile Number
        ↓
Receive OTP
        ↓
Enter OTP
        ↓
Verify OTP
        ↓
Dashboard
Test 5 — Google Login
Google Sign-In
      ↓
Google Authorization
      ↓
Supabase Authentication
      ↓
Dashboard
Test 6 — Protected Route

After signing out, try to open:

http://localhost:3000/dashboard

Expected result:

Redirect to Authentication Page
Test 7 — Password Validation

The following types of passwords should fail validation:

password
Password
Password123
Password!

A valid password example is:

Password123!
🔐 Security Considerations

The project follows several security practices.

Environment Variables

Sensitive credentials are stored in .env.local and excluded from GitHub.

Row Level Security

Supabase RLS restricts database access to authorized users.

Protected Routes

The dashboard verifies the authenticated user before displaying protected content.

Password Validation

Passwords must satisfy multiple complexity requirements.

Server-Side Secrets

Private API keys such as the Resend API key should only be used on the server.

OAuth Security

OAuth credentials should never be exposed in client-side code.

🗄️ Database Architecture

Authentication information is managed by Supabase Auth, while application-specific profile information is stored in the profiles table.

                 Supabase Authentication
                          │
                          ▼
                     auth.users
                          │
                          │ Database Trigger
                          ▼
                    public.profiles
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
        email           phone          full_name
          │
          ├── avatar_path
          ├── location
          └── account_type
🔄 Complete New User Journey

A typical new email user follows this process:

                  START
                    │
                    ▼
            Authentication Page
                    │
                    ▼
               Enter Email
                    │
                    ▼
            Verification OTP
                    │
                    ▼
               Verify OTP
                    │
                    ▼
             Create Password
                    │
                    ▼
             Password Validation
                    │
                    ▼
             Supabase Auth User
                    │
                    ▼
             Database Trigger
                    │
                    ▼
             Create User Profile
                    │
                    ▼
                Dashboard
                    │
                    ▼
                   END
🧩 Application Routes
Route	Purpose
/	Authentication page
/splash	FOXSCAN splash screen
/loading	Loading screen
/set-password	Create account password
/profile-setup	User profile setup
/dashboard	Protected authenticated dashboard
/api/send	Server-side custom email API
📌 Important Files
Authentication
app/page.tsx

Contains the main authentication interface and authentication flows.

Dashboard
app/dashboard/page.tsx

Handles authenticated dashboard access and session checking.

Password Setup
app/set-password/page.tsx

Handles password creation and validation.

Profile Setup
app/profile-setup/page.tsx

Handles user profile information.

Supabase Client
utils/supabase/client.ts

Creates the browser-side Supabase client.

Email API
app/api/send/route.ts

Provides a server-side API route for custom emails through Resend.

Database Trigger
supabase/migrations/002_create_profile_trigger.sql

Creates the automatic profile creation trigger.

Database & Storage
supabase/migrations/003_storage_and_profiles_complete.sql

Contains additional profile and storage configuration.

🏗️ Production Build

Create a production build:

npm run build

Start the production server:

npm start
📦 GitHub

The project source code is available on GitHub:

Repository:

https://github.com/shravaniR14/authentication-project-

The repository does not contain:

.env.local
node_modules/
.next/

These are excluded because they contain local configuration, dependencies, generated files, or sensitive information.

🚧 Current Limitations
SMS

SMS delivery depends on the configured provider and its account status.

Demo/test accounts may restrict OTP delivery to approved numbers.

Google OAuth

Google authentication requires correct Google Cloud Console and Supabase configuration.

Email

Email delivery requires correctly configured SMTP credentials and a verified sending domain.

🔮 Future Improvements

Possible future enhancements include:

Forgot Password
Password Reset through Email
Resend OTP
OTP expiration countdown
Rate Limiting
Login Attempt Protection
CAPTCHA / Bot Protection
Multi-Factor Authentication
Profile Picture Upload UI
Account Deletion
Audit Logs
Security Vulnerability Testing
Automated Testing
Production Deployment
Advanced Dashboard Features
🎯 Learning Objectives

This project was developed to understand the complete authentication workflow.

The main concepts demonstrated are:

User Authentication
OTP-Based Authentication
Email Verification
Password Creation
Google OAuth
Session Management
Protected Routes
PostgreSQL Database
Database Migrations
Database Triggers
PostgreSQL Functions
Row Level Security
Supabase Storage
SMTP Email Delivery
API Routes
Environment Variable Security
Git & GitHub Workflow
👩‍💻 Author

Shravani Rudrawar

BCA – Data Science

