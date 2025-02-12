import { Message } from "@/types/chat";
import { ChatAnthropic } from "@langchain/anthropic";
import { AIMessage, HumanMessage } from "@langchain/core/messages";

// Use edge runtime
export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const messagesArray = messages || [];

    const model = new ChatAnthropic({
      anthropicApiKey: process.env.ANTHROPIC_API_KEY,
      modelName: "claude-3-opus-20240229",
      streaming: true,
    });

    // Convert messages to Langchain format
    const langchainMessages = messagesArray.map((msg: Message) => {
      return msg.role === 'user' 
        ? new HumanMessage(msg.content)
        : new AIMessage(msg.content);
    });

    // Call the model with streaming
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        
        await model.invoke(langchainMessages, {
          callbacks: [
            {
              handleLLMNewToken(token: string) {
                controller.enqueue(encoder.encode(token));
              },
            },
          ],
        });
        
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error: any) {
    console.error('Error in chat route:', error);
    return new Response(
      JSON.stringify({
        error: 'An error occurred while processing your request',
        details: error.message,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
