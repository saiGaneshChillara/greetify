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