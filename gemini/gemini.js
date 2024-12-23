import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { GEMINI_API_KEY } from "../utils/env.js";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
export const gemini = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
export const geminiJson = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: {
      description: "extract data of the post from the text",
      type: SchemaType.OBJECT,
      properties: {
        imageUrl: {
          type: SchemaType.STRING,
          description: "URL of the image",
          nullable: false,
        },
        dishName: {
          type: SchemaType.STRING,
          description: "Name of the dish",
          nullable: false,
        },
        newPrice: {
          type: SchemaType.NUMBER,
          description: "Price of the dish",
          nullable: false,
        },
      },
    },
  },
});
