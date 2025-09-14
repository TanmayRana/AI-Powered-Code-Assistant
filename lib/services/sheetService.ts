import axios from "axios";

const API_URL = "/api/getSheetdata"; // your API route

const getSheets = async () => {
  const response = await axios.get(API_URL);
  return response.data.data; // assuming API returns { data: [...] }
};

export const sheetService = {
  getSheets,
};
