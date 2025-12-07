// scripts/generate-content.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'node:fs/promises';
import path from 'node:path';

// Ensure the API key is loaded from environment variables
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("Error: GEMINI_API_KEY environment variable is not set.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Using gemini-pro for text generation

const PROMPT_DIR = path.resolve(process.cwd(), 'ai', 'prompts', 'chapters');
const OUTPUT_DIR = path.resolve(process.cwd(), 'my-website', 'docs');

async function generateContent() {
  try {
    // Ensure output directory exists
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    const promptFiles = await fs.readdir(PROMPT_DIR);

    for (const file of promptFiles) {
      if (path.extname(file) === '.md') {
        const promptFilePath = path.join(PROMPT_DIR, file);
        const promptContent = await fs.readFile(promptFilePath, 'utf8');

        console.log(`Generating content for ${file}...`);

        const result = await model.generateContent(promptContent);
        const response = await result.response;
        const generatedText = response.text();

        const outputFileName = file; // Keep original filename for output
        const outputFilePath = path.join(OUTPUT_DIR, outputFileName);
        await fs.writeFile(outputFilePath, generatedText);

        console.log(`Content saved to ${outputFilePath}`);
      }
    }
    console.log("Content generation complete.");
  } catch (error) {
    console.error("Error generating content:", error);
    process.exit(1);
  }
}

generateContent();