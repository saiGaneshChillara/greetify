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

};

