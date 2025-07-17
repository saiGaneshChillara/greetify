import { StreamChat } from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
    console.error("Stream API keys are missing");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const createStreamUser = async (userData) => {
    try {
        await streamClient.upsertUsers([userData]);
        return userData;
    } catch (err) {
        console.log("Error in creating stream user:", err);
    }
};

export const generateStreamToken = async (userId) => {
    try {
        const userIdStr = userId.toString();
        return streamClient.createToken(userIdStr);
    } catch (err) {
        console.log("Error in generating stream token:", err);
    }
};