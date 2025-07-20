import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { getOutgoingRequests, getRecommendedUsers, getUserFriends, sendFriendRequest } from '../lib/api';
import { Link } from 'react-router';
import { UsersIcon } from 'lucide-react';

import FriendCard from '../components/FriendCard';
import NoFriendsFound from '../components/NoFriendsFound';
import NoRecommendedUsers from '../components/NoRecommendedUsers';
import RecommendedUserCard from '../components/RecommendedUserCard';

const HomePage = () => {
  const queryClient = useQueryClient();
  
  const [outgoingRequestIds, setOutgoingRequestIds] = useState([]);
  const [pendingUserId, setPendingUserId] = useState(null);

  const { data: friends=[], isLoading: friendsLoading} = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers=[], isLoading: recommendedUsersLoading } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: getRecommendedUsers,
  });

  const { data: outGoingRequests } = useQuery({
    queryKey: ["outgoingRequests"],
    queryFn: getOutgoingRequests,
  });

  const { mutate: sendRequestMutation, isPending: sendingPending, error } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingRequests"] }),
    onMutate: (userId) => {
      setPendingUserId(userId);
    },
    onSettled: () => {
      setPendingUserId(null);
      queryClient.invalidateQueries({ queryKey: ["outgoingRequests"] });
    },
  });

  useEffect(() => {
    const outgoingIds = [];
    if (outGoingRequests && outGoingRequests.length > 0) {
      outGoingRequests.forEach((req) => {
        outgoingIds.push(req.recipient._id);
      });
    }
    setOutgoingRequestIds(outgoingIds);
  }, [outGoingRequests]);

  // if (error) console.log("Error in sedning request", error);
  console.log("Outgoing requests",outgoingRequestIds);
  
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your friends</h2>
          <Link to={"/notifications"} className='btn btn-outline btn-sm'>
            <UsersIcon className='size-4 mr-2' />
            Friend Requests
          </Link>
        </div>
        {friendsLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}
        {/* Recommended users */}
        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Meet New Learners</h2>
                <p className="opacity-70">
                  Discover perfect language exchange partners based on your profile
                </p>
              </div>
            </div>
          </div>
          {recommendedUsersLoading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <NoRecommendedUsers />
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestIds.includes(user._id);

                return (
                  <RecommendedUserCard 
                    key={user._id} 
                    user={user} 
                    hasRequestSent={hasRequestBeenSent} 
                    actionHandler={sendRequestMutation} 
                    isPending={pendingUserId === user._id} 
                  />
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;