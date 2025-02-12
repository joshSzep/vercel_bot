export type Message = {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
};

export type ChatRequest = {
  messages: Message[];
};

export type ChatResponse = {
  content: string;
};
