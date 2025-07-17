import FriendRequest from "../models/friendRequest.model.js";
import User from "../models/user.model.js";

export const getRecommendedUsers = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const currentUser = await User.findById(currentUserId);

        const recommendedUsers = await User.find({
            $and: [
                { _id: { $ne: currentUserId }},
                { _id: { $nin: currentUser.friends }},
                { isOnBoarded: true },
            ]
        });

        return res.status(200).json(recommendedUsers);
    } catch (err) {
        console.log("Error in getReccommendedUsers controller:", err);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const getMyFriends = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select("friends")
            .populate("friends", "fullName profilePic nativeLanguage learningLanguage");
        return res.status(200).json(user.friends);
    } catch (err) {
        console.log("Error in getMyFriends controller:", err);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const sendFriendRequest = async (req, res) => {
    try {
        const myId = req.user._id;
        const { id: recipientId } = req.params;

        // can't send request to your self
        if (myId === recipientId) return res.status(400).json({
            message: "You can't send friend request to yourself",
        });

        // check if recipient exists
        const recipient =  await User.findById(recipientId);
        if (!recipient) return res.status(404).json({
            message: "Recipient not found",
        });

        // check if already both are friends
        if (recipient.friends.includes(myId)) return res.status(400).json({
            message: "You are already friends with this user",
        });

        // check if there is already a pending request
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId },
            ]
        });
        if (existingRequest) return res.status(400).json({
            message: "Friend request already exists",
        });

        // create a new friend request
        const newRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId,
        });

        return res.status(201).json(newRequest);
    } catch (err) {
        console.log("Error in sendFriendRequest controller:", err);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const acceptFriendRequest = async (req, res) => {
    try {
        const { id: requestId } = req.params;

        const friendRequest = await FriendRequest.findById(requestId);
        if (!friendRequest) return res.status(404).json({
            message: "Friend request not found",
        });

        if (friendRequest.recipient.toString() !== req.user._id.toString()) return res.status(403).json({
            message: "You are not authorized to accept this friend request",
        });

        if (friendRequest.status === "accepted") return res.status(400).json({
            message: "Friend request already accepted",
        });

        friendRequest.status = "accepted";
        await friendRequest.save();

        // add each user to other's friends list
        await User.findByIdAndUpdate(friendRequest.sender, {
            $push: { friends: friendRequest.recipient },
        });

        await User.findByIdAndUpdate(friendRequest.recipient, {
            $push: { friends: friendRequest.sender },
        });

        return res.status(200).json({
            message: "Friend request accepted",
        });
    } catch (err) {
        console.log("Error in accpetFriendRequest controller:", err);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const getFriendRequests = async (req, res) => {
    try {
        const incomingRequests = await FriendRequest.find({
            recipient: req.user._id,
            status: "pending",
        }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

        const acceptedRequests = await FriendRequest.find({
            sender: req.user._id,
            status: "accepted",
        }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json({ incomingRequests, acceptedRequests });
    } catch (err) {
        console.log("Error in getFriendRequests controller:", err);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const getOutgoingFriendRequests = async (req, res) => {
    try {
        const outgoingRequests = await FriendRequest.find({
            sender: req.user._id,
            status: "pending",
        }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

        return res.status(200).json(outgoingRequests);
    } catch (err) {
        console.log("Error in getOutgoingFriendRequests controller:", err);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};