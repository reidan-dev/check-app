import { useChatStore } from './store/chatStore';
import { ChatHeader } from './components/header';
import { ChatLayout } from './components/layout';
import { MessageList, ChatContainer } from './components/chat';

const App = () => {
    const { messages, isTyping } = useChatStore();

    return (
        <ChatLayout>
            <ChatHeader />
            <MessageList messages={messages} isTyping={isTyping} />
            <ChatContainer />
        </ChatLayout>
    );
};

export default App;
