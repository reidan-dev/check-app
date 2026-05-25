import { useRef } from "react";
import { Send } from "lucide-react";

const InputArea = ({ inputValue, onInputChange, onSend, disabled }) => {
    const inputRef = useRef(null);

    return (
            <form onSubmit={(e) => { e.preventDefault(); onSend(); }} className="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <input
                        ref={inputRef}
                        type="text"
                         value={inputValue}
                        onChange={(e) => onInputChange(e.target.value)}
                        placeholder="Type your message..."
                         disabled={disabled}
                        className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
                    />
                     <button
                         type="submit"
                        disabled={!inputValue.trim() || disabled}
                        className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-md hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                         <Send size={20} className={!inputValue.trim() || disabled ? "-rotate-45" : "rotate-0"} />
                     </button>
               </div>
          </form>
       );
};

export default InputArea;
