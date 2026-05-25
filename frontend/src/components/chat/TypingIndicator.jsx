import { Bot } from "lucide-react";

const TypingIndicator = () => {
    return (
          <div className="flex justify-start mb-3 message-enter">
             <div className="flex items-end gap-2">
                 <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                     <Bot size={16} className="text-white" />
                </div>
                 <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
                     <div className="flex gap-1">
                         <span className="loading-dot w-2 h-2 bg-blue-500 rounded-full"></span>
                         <span className="loading-dot w-2 h-2 bg-blue-500 rounded-full"></span>
                         <span className="loading-dot w-2 bg-blue-500 rounded-full"></span>
                     </div>
                 </div>
             </div>
       </div>
    );
};

export default TypingIndicator;
