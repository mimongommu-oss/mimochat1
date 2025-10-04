import React from 'react';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import { useAuthStore } from '../store/authStore';

const AuthNavigator: React.FC = () => {
    const authPage = useAuthStore((state) => state.authPage);

    switch(authPage) {
      case 'signup':
        return <SignupPage />;
      case 'login':
      default:
        return <LoginPage />;
    }
}

export default AuthNavigator;
