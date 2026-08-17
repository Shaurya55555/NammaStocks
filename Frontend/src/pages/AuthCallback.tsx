/**
 * AuthCallback.tsx — no longer used.
 *
 * Clerk handles all OAuth redirects internally via ClerkProvider.
 * This file is kept to avoid broken imports; it simply redirects to the dashboard.
 */
import { Navigate } from 'react-router-dom';

const AuthCallback: React.FC = () => <Navigate to="/dashboard" replace />;

import React from 'react';
export default AuthCallback;
