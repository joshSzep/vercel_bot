import { Message } from "@/types/chat";

export function ChatMessage({ message }: { message: Message }) {
  return (
    <div
      className={`flex ${
        message.role === "user" ? "justify-end" : "justify-start"
      } mb-4`}
    >
      <div
        className={`${
          message.role === "user"
            ? "bg-blue-600 text-white"
            : "bg-gray-800 text-gray-100"
        } rounded-lg px-4 py-2 max-w-[80%] break-words`}
      >
        {message.content}
      </div>
    </div>
  );
}
