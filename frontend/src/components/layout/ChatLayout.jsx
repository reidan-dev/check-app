const ChatLayout = ({ children }) => {
    return (
           <div className="flex flex-col h-full bg-gradient-to-b from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
              {children}
          </div>
       );
};

export default ChatLayout;
