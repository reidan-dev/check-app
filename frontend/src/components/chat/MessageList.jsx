import { useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

const MessageList = ({ messages, isTyping }) => {
     const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
       };

      useEffect(() => {
        scrollToBottom();
       }, [messages, isTyping]);

    return (
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {/* Render all messages except quick_replies */}
            {messages.filter(m => m.type !== "quick_replies").map(msg => (
                  <MessageBubble key={msg.id} message={msg} />
               ))}

              {/* Typing indicator when bot is processing */}
              {isTyping && <TypingIndicator />}

                <div ref={messagesEndRef} />
           </div>
      );
};

export default MessageList;
