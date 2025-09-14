import axios from "axios";

const getFollowingData = async (userId: string) => {
  try {
    const response = await axios.get(`/api/Following?userId=${userId}`);

    return response.data;
  } catch (error) {
    console.error("Error fetching following data:", error);
    throw error;
  }
};

const followingService = {
  getFollowingData, // Corrected function name
};

export default followingService;
