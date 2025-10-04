
import * as handler from './handler';
import type { Chat } from '../types/index';

/**
 * This file simulates the client-side API layer. In a real application, this
 * is where you would use `fetch` to make network requests to your backend.
 * The rest of the application should only interact with this client, not
 * directly with any service that uses secret keys.
 */

interface StreamAiResponseParams {
    chat: Chat;
    text: string;
    image: string | null;
    audio: string | null;
}

export const streamAiResponse = async (params: StreamAiResponseParams): Promise<AsyncGenerator<string>> => {
    // In a real app:
    // const response = await fetch('/api/chat', { method: 'POST', body: JSON.stringify(params) });
    // return handleStreamingResponse(response);
    
    // For simulation, we call the handler directly.
    return handler.handleAiResponseStream(params);
};

export const fetchSuggestions = async (prompt: string): Promise<string[]> => {
    // In a real app:
    // const response = await fetch('/api/suggestions', { method: 'POST', body: JSON.stringify({ prompt }) });
    // return response.json();

    // For simulation:
    return handler.handleGenerateSuggestions(prompt);
};
