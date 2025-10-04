
import { GoogleGenAI, Chat as GenAIChat, Type, Part } from '@google/genai';
import type { Chat } from '../types/index';
import { USER_INFO } from '../data/mock';

/**
 * This file simulates a secure backend handler. In a real application, this
 * logic would live on a server, and the API key would never be exposed to the client.
 */

// --- Singleton Gemini AI Instance ---
let ai: GoogleGenAI | null = null;

function getAiInstance(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API_KEY environment variable not set. The GeminiService cannot be initialized.");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}
// ------------------------------------

// In-memory store for active chat instances to maintain conversation history
const chatInstances = new Map<string, GenAIChat>();

function getChatInstance(chatData: Chat): GenAIChat {
  if (chatInstances.has(chatData.id)) {
    return chatInstances.get(chatData.id)!;
  }

  const history = chatData.messages
    .filter(msg => msg.text) // Only include messages with text in history for now
    .map(msg => ({
      role: msg.sender.id === USER_INFO.id ? 'user' : 'model',
      parts: [{ text: msg.text || '' }]
    }));

  const contactName = chatData.contact?.name || 'a helpful assistant';

  const newChatInstance = getAiInstance().chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are a helpful and friendly assistant. If this is a one-on-one chat, you are acting as a person named "${contactName}". If this is a group chat with multiple people, you are acting as "Gemini Assistant". Keep your responses concise and conversational, like a text message. You can also analyze and respond to images. If the user sends a voice message, acknowledge it.`,
    },
    history: history
  });

  chatInstances.set(chatData.id, newChatInstance);
  return newChatInstance;
}

interface StreamParams {
    chat: Chat;
    text: string;
    image: string | null;
    audio: string | null;
}

export async function handleAiResponseStream({ chat, text, image, audio }: StreamParams): Promise<AsyncGenerator<string>> {
  const chatInstance = getChatInstance(chat);

  const messageParts: Part[] = [];
  if (image) {
    const [header, data] = image.split(',');
    const mimeType = header.match(/:(.*?);/)?.[1] ?? 'image/jpeg';
    messageParts.push({ inlineData: { data, mimeType } });
  }

  let promptText = text;
  if (audio && !text) {
    promptText = "[User sent a voice message]";
  }

  if (promptText) {
    messageParts.push({ text: promptText });
  }

  if (messageParts.length === 0) {
    return (async function*() {})();
  }

  const responseStream = await chatInstance.sendMessageStream({ message: messageParts });
  
  async function* textStream(): AsyncGenerator<string> {
      for await (const chunk of responseStream) {
          yield chunk.text;
      }
  }
  
  return textStream();
}

export async function handleGenerateSuggestions(prompt: string): Promise<string[]> {
  try {
    const response = await getAiInstance().models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Based on the following user intention, generate 3 distinct message suggestions. The suggestions should be a casual one, a professional one, and an original/creative one. The user's intention is: "${prompt}"`,
      config: {
          responseMimeType: "application/json",
          responseSchema: {
              type: Type.OBJECT,
              properties: {
                  casual: { type: Type.STRING },
                  professional: { type: Type.STRING },
                  original: { type: Type.STRING },
              },
              required: ["casual", "professional", "original"],
          },
      }
    });
    const jsonResponse = JSON.parse(response.text);
    return [jsonResponse.casual, jsonResponse.professional, jsonResponse.original];
  } catch(e) {
    console.error("Error generating suggestions:", e);
    return ["Sorry, couldn't get suggestions.", "Please try again.", "Maybe rephrase your prompt?"];
  }
}
