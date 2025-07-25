import React from 'react';
import { Navigate, Route, Routes } from 'react-router';

import HomePage from "./pages/HomePage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import OnboardingPage from "./pages/OnBoardingPage.jsx";

import { Toaster } from "react-hot-toast";
import PageLoader from './components/PageLoader.jsx';
import { useAuthUser } from './hooks/useAuthUser.js';
import Layout from './components/Layout.jsx';
import { useThemeStore } from './store/useThemeStore.js';

const App = () => {
  const { isLoading: authLoading, authUser } = useAuthUser();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnBoarded;

  const { theme } = useThemeStore();

  if (authLoading) return <PageLoader />;

  return (
    <div className='h-screen' data-theme={theme}>
      <Routes>
        <Route 
          path='/' 
          element={
            isAuthenticated  && isOnboarded ?
            <Layout showSidebar={true}>
              <HomePage />
            </Layout> 
            : <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
          } 
        />
        <Route 
          path='/signup' 
          element={
            !isAuthenticated ? 
            <SignupPage /> : 
            <Navigate to={isOnboarded ? "/" : "/onboarding" } />
          } 
        />
        <Route 
          path='/login' 
          element={
            !isAuthenticated ? 
            <LoginPage /> : 
            <Navigate to={isOnboarded ? "/" : "/onboarding" } />
          } 
        />
        <Route 
          path='/notifications' 
          element={
            isAuthenticated ? 
            <NotificationsPage /> : 
            <Navigate to={"/login"} />
          } 
        />
        <Route 
          path='/call' 
          element={
            isAuthenticated ? 
            <CallPage /> : 
            <Navigate to={"/login"} />
          }
        />
        <Route 
          path='/chat' 
          element={
            isAuthenticated ? 
            <Layout>
              <ChatPage />
            </Layout> : 
            <Navigate to={"/login"} />
          }
        />
        <Route 
          path='/onboarding' 
          element={
            isAuthenticated ? (
              !isOnboarded ? (
                <OnboardingPage />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;