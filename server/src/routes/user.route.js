import express from "express";
import { acceptFriendRequest, getFriendRequests, getMyFriends, getRecommendedUsers, sendFriendRequest } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// apply auth middleware to all the routes
router.use(protectRoute);

router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);

router.post("/friend-request/:id", sendFriendRequest);
router.post("/friend-request/:id/accept", acceptFriendRequest);

router.get("/friend-requests", getFriendRequests);

export default router;