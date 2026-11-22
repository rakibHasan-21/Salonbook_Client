SalonBook --- Client
A modern, responsive salon appointment booking platform where customers
can explore salon services, request appointments, manage their bookings,
and pay online. The client application provides a smooth booking
experience and role-based dashboards for customers and administrators.
Live Demo
- Client Website: https://salonbook-client-eta.vercel.app
- Backend API: https://salonbook-server-delta.vercel.app
Features
- Responsive salon-themed user interface for desktop, tablet, and
  mobile
- Browse active salon services
- Search services by name
- Filter services by category
- Sort services by price
- View detailed service information
- Better Auth authentication with email/password and Google login
- Role-based navigation and protected dashboards
- Customer dashboard with appointment statistics and appointment
  history
- Book salon appointments with date, time slot, and optional message
- Cancel pending appointment requests
- Pay for confirmed appointments through Stripe Checkout
- View payment status and transaction history
- Admin dashboard to manage services, appointments, customers, and
  transactions
- Add, update, delete, activate, and deactivate salon services
- Upload service images
- Manage customer profiles
- Loading states, form validation, and toast notifications
Technology Stack
- Framework: Next.js
- Language: JavaScript / TypeScript
- UI: React, Tailwind CSS
- Authentication: Better Auth
- Icons: Lucide React
- Notifications: React Toastify
- Payment: Stripe
- Deployment: Vercel
Getting Started
Follow these steps to run the client application locally.
1. Clone the repository
git clone YOUR_CLIENT_REPOSITORY_URL
2. Go to the project directory
cd salonbook-client
3. Install dependencies
npm install
4. Configure environment variables
Create a .env.local file in the root directory and add the required
variables:
NEXT_PUBLIC_API_URL=
BETTER_AUTH_URL=
BETTER_AUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
Use the appropriate values from your own development environment. Never
commit .env.local or expose secret credentials in the repository.
5. Run the development server
npm run dev
Open http://localhost:3000 in your browser.
6. Build for production
npm run build
npm start
Project Structure
A typical client-side structure:
salonbook-client/
├── public/
├── src/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── ...
├── .env.example
├── package.json
└── README.md
Your actual folder structure may vary depending on the project setup.
Environment Variables
  Variable                               Purpose
  NEXT_PUBLIC_API_URL                  Backend API base URL

  BETTER_AUTH_URL                      Application URL used by Better Auth

  BETTER_AUTH_SECRET                   Secret used by Better Auth

  GOOGLE_CLIENT_ID                     Google OAuth client ID

  GOOGLE_CLIENT_SECRET                 Google OAuth client secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY   Stripe publishable key used by the
client
Add only the variables required by your actual client configuration.
Keep secret values private and configure production variables in the
Vercel project settings.
Related Repository
- Client Repository: Add your client GitHub repository URL
- Server Repository: Add your server GitHub repository URL
Important Notes
- The backend server must be running and correctly configured for the
  client application to work locally.
- Configure the correct client and server URLs for authentication, API
  requests, and Stripe redirects.
- Never upload .env files, API keys, OAuth secrets, Stripe secret
  keys, or other credentials to GitHub.
- Payment status should be treated as successful only after the
  backend verifies the Stripe webhook event.
Built with ❤️ for a better salon booking experience.