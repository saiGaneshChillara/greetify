import { CheckCircle2Icon, MapPinIcon, UserPlusIcon } from 'lucide-react';
import React from 'react';
import { getLanguageFlag } from './FriendCard';

const RecommendedUserCard = ({ user, hasRequestSent, actionHandler, isPending }) => {
  const capitalize =(str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="card bg-base-200 hover:shadow-lg transition-all duration-300">
      <div className="card-body p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="avatar size-16 rounded-full">
            <img src={user.profilePic} alt={user.fullName} />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{user.fullName}</h3>
            {user.location && (
              <div className="flex items-center text-xs opacity-70 mt-1">
                <MapPinIcon className='size-3 mr-1' />
                {user.location}
              </div>
            )}
          </div>
        </div>
        {/* languages and flags */}
        <div className="flex flex-wrap gap-1.5">
          <span className="badge badge-secondary">
            {getLanguageFlag(user.nativeLanguage)}
            Native: {capitalize(user.nativeLanguage)}
          </span>
          <span className="badge badge-outline">
            {getLanguageFlag(user.learningLanguage)}
            Learning: {capitalize(user.learningLanguage)}
          </span>
        </div>
        {/* bio */}
        {user.bio && <p className='text-sm opacity-70'>{user.bio}</p>}
        {/* action button */}
        <button
          className={`btn w-full mt-2 ${hasRequestSent ? "btn-disabled" : "btn-primary"}`}
          onClick={() => actionHandler(user._id)}
          disabled={hasRequestSent || isPending}
        >
          {hasRequestSent ? (
            <>
              <CheckCircle2Icon className='size-4 mr-2' />
              Request Sent
            </>
          ) : (
            <>
              <UserPlusIcon className="size-4 mr-2" />
              Send Friend Request
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default RecommendedUserCard;