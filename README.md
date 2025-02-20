# My Next.js Tailwind TypeScript Application

This project is a modern, production-ready web application built with Next.js, TypeScript, and Tailwind CSS. It features modular components, custom form validation, responsive design, API integration using Axios, and non-blocking notifications with React Toastify. The project supports both individual and corporate registration flows, complete with custom loaders, error handling, and a custom 404 page.

## Table of Contents

- [My Next.js Tailwind TypeScript Application](#my-nextjs-tailwind-typescript-application)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Folder Structure](#folder-structure)
  - [Installation and Setup](#installation-and-setup)
  - [API Integration](#api-integration)
  - [Form Validation \& Registration Flow](#form-validation--registration-flow)
  - [Notifications](#notifications)
  - [Custom 404 Page](#custom-404-page)
  - [Development and Deployment](#development-and-deployment)
  - [License](#license)

## Overview

This application is designed to provide a seamless user experience for registration and authentication. It uses a multi-step registration flow with both individual and corporate registration processes. The app leverages reusable components for forms, buttons, and error messages and integrates custom form validation hooks to enforce input requirements. Additionally, the project uses React Toastify for notifications and features a custom 404 page.

## Features

- **Next.js & TypeScript**: Full type safety and modern React server/client components.
- **Tailwind CSS**: Utility-first styling for rapid and responsive UI development.
- **API Integration**: Centralized API calls using Axios with a dedicated instance configured via environment variables.
- **Custom Form Validation**: Reusable hooks for validating both individual and corporate registration forms.
- **Multi-Step Registration**: Separate flows for individual and corporate signups with step progress indicators.
- **Notifications**: React Toastify provides non-blocking notifications with customizable progress bars.
- **Responsive & Mobile-First Design**: Fully responsive components with mobile-friendly layouts and custom breakpoints.
- **Custom 404 Page**: A branded 404 page replacing the default Next.js error screen.

## Tech Stack

- **Next.js** – React framework for server-side rendering and static site generation.
- **TypeScript** – For static type-checking and improved code quality.
- **Tailwind CSS** – For rapid UI development and responsive design.
- **Axios** – For handling API requests.
- **React Toastify** – For displaying toast notifications.
- **React Context & Custom Hooks** – For state management and form validation.

## Folder Structure

```plaintext
my-nextjs-app/
├── public/ # Static assets (images, fonts, icons)
├── src/
│   ├── api/ # API integration using Axios
│   │   ├── axiosInstance.ts # Axios instance with base URL from env variable
│   │   └── auth/
│   │       ├── login.ts # Login API calls
│   │       ├── password-reset.ts # Password reset API calls
│   │       ├── register.ts # Registration API calls (individual & corporate)
│   │       └── resendCode.ts # Resend verification code API calls
│   ├── components/ # Reusable UI components
│   │   ├── button.tsx
│   │   ├── errorMessage.tsx
│   │   ├── formInput.tsx
│   │   ├── formWrapper.tsx
│   │   └── stepProgress.tsx
│   ├── contexts/ # Global context (e.g., registrationContext.tsx)
│   ├── hooks/ # Custom hooks
│   │   ├── corporate/
│   │   │   └── useFormValidation.ts
│   │   └── individual/
│   │       └── useFormValidation.ts
│   ├── pages/ # Next.js pages (or /app/ if using the App Router)
│   │   └── register/
│   │       ├── individual/
│   │       │   ├── basic-information/page.tsx
│   │       │   ├── login-details/page.tsx
│   │       │   └── otp-verification/page.tsx
│   │       └── corporate/
│   │           └── registration-successful/page.tsx
│   └── styles/ # Global styles and Tailwind configuration
│       └── globals.css
├── next.config.ts # Next.js configuration file
├── .env # Environment variables (NEXT_PUBLIC_API_URL, etc.)
└── package.json
```

## Installation and Setup

Clone the repository:

```bash
git clone <repository-url>
cd my-nextjs-app
```

Install dependencies:

```bash
npm install
# or
yarn install
```

Configure Environment Variables:
Create a `.env` file in the root directory and add:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Run the development server:

```bash
npm run dev
# or
yarn dev
```

## API Integration

API calls are centralized in the `/src/api` folder. For example:

**Axios Instance:**

```typescript
// /src/api/axiosInstance.ts
import axios from "axios";
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
export default axiosInstance;
```

**Login API:**

```typescript
// /src/api/auth/login.ts
import axiosInstance from "../axiosInstance";
export interface LoginDto {
  email: string;
  password: string;
}
export interface LoginResponse {
  access_token: string;
}
export async function login(dto: LoginDto): Promise<LoginResponse> {
  const response = await axiosInstance.post<LoginResponse>("/auth/login", dto);
  return response.data;
}
```

## Form Validation & Registration Flow

Custom hooks under `/src/hooks/individual` and `/src/hooks/corporate` manage form validations. For instance, in the corporate registration flow, the `useCompanyFormValidation` hook validates fields such as:

- Company Name
- Business Type (dropdown: RETAIL, SERVICE, MANUFACTURING)
- Date of Incorporation
- Company Email
- Password
- Confirm Password

If validation fails, dynamic error messages are displayed using the `ErrorMessage` and inline error indicators on `FormInput` components. Data is stored in `localStorage` for multi-step registration until the final step where the complete API call is made.

## Notifications

React Toastify is used for notifications (e.g., registration success). To integrate:

**Installation:**

```bash
npm install react-toastify
# or
yarn add react-toastify
```

**Usage in `_app.tsx` or layout:**

```typescript
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick={false}
        pauseOnHover
        draggable
        theme="light"
        transition={Slide}
      />
    </>
  );
}

export default MyApp;
```

**Triggering a Toast:**

```typescript
import { toast } from "react-toastify";
toast.success("Registration Successful!");
```

## Custom 404 Page

For a custom 404 page, if you are using the App Router (Next.js 13), create a `not-found.tsx` file in the app folder:

```typescript
// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-6">
        Sorry, we couldn’t find the page you’re looking for.
      </p>
      <Link href="/" className="text-blue-500 hover:underline">
        Go back home
      </Link>
    </div>
  );
}
```

## Development and Deployment

**Development:**
Run the development server:

```bash
npm run dev
# or
yarn dev
```

**Production Build:**
Build your application with:

```bash
npm run build
npm run start
```

Deploy your application to platforms like Vercel, Netlify, or any Node.js hosting provider.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
