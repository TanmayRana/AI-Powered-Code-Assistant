import axios from "axios";

export interface FollowSheetsPayload {
  userId: string;
  followedSheetIds: string[];
}

export const followingService = {
  // ✅ Fetch followed sheets
  async fetchFollowedSheets(userId: string) {
    const res = await axios.get(`/api/Following?userId=${userId}`);
    return res.data.sheets;
  },

  // ✅ Follow sheets
  async followSheets(payload: FollowSheetsPayload) {
    const res = await axios.post("/api/Following", payload);
    return res.data;
  },

  // ✅ Unfollow sheet
  async unfollowSheet(userId: string, unfollowedSheetId: string) {
    const res = await axios.post("/api/UnFollowing", { userId, unfollowedSheetId });
    return res.data;
  },
};
