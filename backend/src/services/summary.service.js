import genAI from "../config/gemini.js";

export const generateSummary = async (content) => {

  const model =
  genAI.getGenerativeModel({
    model: "gemini-1.5-flash"
  });

  const result =
  await model.generateContent(
    `
    Summarize this blog
    in 5 concise points:

    ${content}
    `
  );

  return result.response.text();
};