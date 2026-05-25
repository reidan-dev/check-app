import { Bot, Heart } from "lucide-react";

const ChatHeader = () => {
    return (
        <header className="bg-white dark:bg-gray-800 shadow-sm px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                <Bot size={20} className="text-white" />
           </div>
            <div>
                <h1 className="font-semibold text-gray-800 dark:text-white">Check-App</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Heart size={10} className="text-red-500 fill-red-500" /> Medical Assistant
               </p>
            </div>
       </header>
   );
};

export default ChatHeader;
