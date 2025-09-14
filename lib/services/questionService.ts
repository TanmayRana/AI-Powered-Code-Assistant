// /lib/services/questionService.ts
import axios from "axios";

const getQuestionById = async (id: string) => {
  const response = await axios.get(`/api/getQuestiondata?id=${id}`);
  return response.data;
};

const QuestionService = {
  getQuestionById,
};

export default QuestionService;
