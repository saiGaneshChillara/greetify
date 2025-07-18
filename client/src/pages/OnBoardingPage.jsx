import React, { useState } from 'react';
import { useAuthUser } from '../hooks/useAuthUser';
import PageLoader from '../components/PageLoader';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { completeOnboarding } from '../lib/api';
import toast from 'react-hot-toast';
import { CameraIcon, LoaderIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon } from 'lucide-react';
import { LANGUAGES } from "../constants/index.js";

const OnBoardingPage = () => {
  const { authUser, isLoading: authLoading } = useAuthUser();
  const queryClient = useQueryClient();

  const [userData, setUserData] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Onboarding complete");
      queryClient.invalidateQueries(["authUser"]);
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(userData);
  };

  const handleRandomAvatar = (e) => {
    e.preventDefault();
    const index = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${index}.png`;
    setUserData({ ...userData, profilePic: randomAvatar });
    toast.success("Profile randomly selected");
  };

  console.log("User data is", authUser);

  if (authLoading) return <PageLoader />;

  return (
    <div className='min-h-screen bg-base-100 flex items-center justify-center p-4'>
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className='text-2xl sm:text-3xl font-bold text-center mb-6'>
            Complete Your Profile
          </h1>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* profile pic container */}
            <div className="flex flex-col items-center justify-center space-y-4">
              {/* image */}
              <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                {userData.profilePic ? (
                  <img
                    src={userData.profilePic}
                    alt='Profile Pic'
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className='size-12 text-base-content opacity-40' />
                  </div>
                )}
              </div>
              {/* generate random button */}
              <div className="flex items-center gap-2">
                <button
                  className="btn btn-accent"
                  type='button'
                  onClick={handleRandomAvatar}
                >
                  <ShuffleIcon className="size-4 mr-2" />
                  Generate Random Avatar
                </button>
              </div>
            </div>
            {/* fullName */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type='text'
                name="fullName"
                value={userData.fullName}
                onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
                className='input input-bordered w-full'
                placeholder='Your Full Name'
              />
            </div>
            {/* bio */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                name="bio"
                value={userData.bio}
                onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                className='textarea textarea-bordered h-24'
                placeholder='Your Bio goes here'
              />
            </div>
            {/* languages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* native language */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Native Language</span>
                </label>
                <select 
                  name="nativeLanguage"
                  value={userData.nativeLanguage}
                  onChange={(e) => setUserData({ ...userData, nativeLanguage: e.target.value })}
                  className='select select-bordered w-full'
                >
                  <option value="">Select your native language</option>
                  {LANGUAGES.map((language) => (
                    <option value={language.toLowerCase()} key={`native-${language}`}>
                      {language}
                    </option>
                  ))}
                </select>
              </div>
              {/* learning language */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Learning Language</span>
                </label>
                <select 
                  name="learningLanguage"
                  value={userData.learningLanguage}
                  onChange={(e) => setUserData({ ...userData, learningLanguage: e.target.value })}
                  className='select select-bordered w-full'
                >
                  <option value="">Select the language you're learning</option>
                  {LANGUAGES.map((language) => (
                    <option key={`learning-${language}`} value={language.toLowerCase()}>
                      {language}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* location */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className='absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70' />
                <input 
                  type="text"
                  name="location"
                  value={userData.location}
                  onChange={(e) => setUserData({ ...userData, location: e.target.value })}
                  className='input input-bordered w-full p-10'
                  placeholder='City, Country'
                />
              </div>
            </div>
            {/* submit button */}
            <button className='btn btn-primary w-full' disabled={isPending} type='submit'>
              {!isPending ? (
                <>
                  <ShipWheelIcon className='size-5 mr-2' />
                  Complete Onboarding
                </>
              ) : (
                <>
                  <LoaderIcon className="animate-spin size-5 mr-2" />
                  Onboarding...
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnBoardingPage;