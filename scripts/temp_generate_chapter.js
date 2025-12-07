import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'node:fs/promises';
import path from 'node:path';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("Error: GEMINI_API_KEY environment variable is not set.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

const prompt = `You are a teacher explaining robotics concepts to students. Write a chapter titled 'Cognitive Planning -> Natural language -> ROS 2 actions' for a module called 'Vision-Language-Action (VLA)'. Ensure the wording is easy, student-friendly, includes real-world examples, and explains concepts step-by-step. Avoid advanced jargon and teach like an engaging educator.`;

async function generateAndSaveContent() {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text();
    const tempFilePath = path.join(process.cwd(), 'temp_chapter_content.md');
    await fs.writeFile(tempFilePath, generatedText);
    console.log("Content generated and saved to temp_chapter_content.md");
  } catch (error) {
    console.error("Error generating content:", error);
    process.exit(1);
  }
}

generateAndSaveContent();