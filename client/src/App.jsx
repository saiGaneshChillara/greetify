import React from 'react';
import { Route, Routes } from 'react-router';

import HomePage from "./pages/HomePage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import OnboardingPage from "./pages/OnBoardingPage.jsx";

import toast, { Toaster } from "react-hot-toast";
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from './lib/axiosInstance.js';

const App = () => {

  const { data } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/me");
      return res.data;
    },
    retry: false,
  });

  console.log(data);

  return (
    <div className='h-screen' data-theme="night">
      <button onClick={() => toast.success("Hello")}>create tosast</button>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/notifications' element={<NotificationsPage />} />
        <Route path='/call' element={<CallPage />} />
        <Route path='/chat' element={<ChatPage />} />
        <Route path='/onboarding' element={<OnboardingPage />} />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;