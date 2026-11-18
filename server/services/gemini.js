
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing from .env");
}

const ai = new GoogleGenAI({
  apiKey: apiKey,
});

export const generateEmail = async ({
  recipient,
  recipientName,
  topic,
  tone = "professional",
}) => {
  const prompt = `
    You are a professional email writing assistant.

    Recipient: ${recipient}
    Recipient name: ${recipientName}
    Topic: ${topic}
    Tone: ${tone}

    Return ONLY valid JSON:
    {
      "subject": "Email subject",
      "body": "Complete email body"
    }
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const result = JSON.parse(response.text);

  return result;
};


export async function reviseEmail({
  currentEmail,
  feedback,
}) {
  return {
    subject: currentEmail.subject,
    body: `${currentEmail.body}\n\n[Revision requested: ${feedback}]`,
  };
}