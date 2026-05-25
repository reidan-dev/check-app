import { Bot, User } from "lucide-react";
import formatMessage from "../../utils/messageFormatter.jsx";

const MessageBubble = ({ message }) => {
     const isBot = message.type === "bot";

    return (
           <div className={`flex ${isBot ? "justify-start" : "justify-end"} message-enter mb-3`}>
               <div className={`flex items-end gap-2 max-w-[85%] ${isBot ? "" : "flex-row-reverse"}`}>
                   <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isBot ? "bg-gradient-to-br from-blue-500 to-purple-600" : "bg-gradient-to-br from-green-500 to-emerald-600"}`}>
                       {isBot ? <Bot size={16} className="text-white" /> : <User size={16} className="text-white" />}
                   </div>
                   <div className={`px-4 py-3 rounded-2xl ${isBot ? "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-sm rounded-tl-none" : "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm rounded-tr-none"}`} style={{ whiteSpace: "pre-line" }}>
                       {formatMessage(message.text)}
                   </div>
               </div>
         </div>
      );
};

export default MessageBubble;
