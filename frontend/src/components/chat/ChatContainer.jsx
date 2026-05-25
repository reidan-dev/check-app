import { useState, useEffect } from "react";
import { useChatStore } from "../../store/chatStore";
import ChatState from "../../constants/chatStates";
import { isTerminalState } from "../../utils/chatFlow";
import api from "../../services/api";

const ChatContainer = () => {
    const {
        messages,
        chatState,
        userData,
        addBotMessage,
        addUserMessage,
        showQuickReplies,
        removeQuickReplies,
        setChatState,
        updateUserData,
        resetStore
      } = useChatStore();

    const [inputValue, setInputValue] = useState("");

    // Initialize chat with greeting
    useEffect(() => {
        const timeNow = new Date();
        const hour = timeNow.getHours();
        let greeting = "Hi there";

        if (hour >= 5 && hour < 12) greeting = "Good morning";
        else if (hour >= 12 && hour < 18) greeting = "Good afternoon";
        else if (hour >= 18 && hour < 22) greeting = "Good evening";
        else greeting = "Hello there";

        addBotMessage(greeting);

        setTimeout(() => {
            addBotMessage("Welcome to **Check-App**! 💊\n\nI'm here to help you find the right doctor for your medical concern. I specialize in head and neck area symptoms.\n\n**How can I help you today?**");
            showQuickReplies([
                { label: "Consult my condition", value: "onConsult" },
                { label: "Learn about Check-App", value: "onLearn" }
              ]);
            setChatState(ChatState.CHOICE);
          }, 500);

        return () => resetStore();
      }, []);

    const getAboutMessage = () => {
        return "Awesome! \n\n*Check-App* v0.1 is a project made to help you find the right kind of doctor for your medical concern.\n\nCheck out https://github.com/reidan-dev/check-app for more info.";
     };

    const processSymptomAnalysis = async (symptoms) => {
        try {
            const result = await api.analyzeSymptoms(symptoms);

            if (result.success) {
                if (result.specialist === "Undecided") {
                    addBotMessage("Sorry!\n\nI can't confidently recommend a specialist based on the symptoms you entered.\n\nI suggest you consult with a **General Physician** via telemedicine.\n\nHere are my recommendations:\n\n**Dr. Lady Adele Carey**\nTelemedicine: drmabait@consult.com\n\n**Dr. Leopold G. Hiran**\nTelemedicine: nicedoctor@telemed.com");
                    setChatState(ChatState.BYE);
                } else {
                    const displaySpecialist = result.specialist === "Ear, Nose, Throat" ? "ENT Specialist" : result.specialist;
                    updateUserData({ specialist: result.specialist });
                    addBotMessage(`Okay. Based on your symptoms, it seems like you might need to consult a **${displaySpecialist}**.`);
                    showQuickReplies([
                        { label: "Recommend to me", value: "onRecommendRequest" },
                        { label: "I'll check my own", value: "onDismiss" }
                      ]);
                    setChatState(ChatState.RESULT_OPTIONS);
                }
            } else {
                addBotMessage("Sorry, there was an error analyzing your symptoms. Please try again.");
                setChatState(ChatState.CHOICE);
            }
        } catch (error) {
            console.error("Error:", error);
            addBotMessage("Sorry, I'm having trouble connecting right now. Please make sure the backend server is running.");
        }
    };

    const processLocation = async (location) => {
        try {
            const result = await api.recommendSpecialists(userData.specialist, location);

            if (result.success) {
                if (result.localDoctors && result.localDoctors.length > 0) {
                    addBotMessage(`Searched for **${userData.specialist}** in **${location}**:`);

                    result.localDoctors.slice(0, 3).forEach((doc, index) => {
                        setTimeout(() => {
                            addBotMessage(`\n**Dr. ${doc.doctor}**\n📍 ${doc.clinic}\n📞 ${doc.contact || "N/A"}`);
                          }, index * 300);
                      });
                } else {
                    addBotMessage(`Searched for **${userData.specialist}** in **${location}**\n\nNo specialists found in your area.\n\nYou can consult via telemedicine:`);

                    if (result.onlineDoctors && result.onlineDoctors.length > 0) {
                        result.onlineDoctors.slice(0, 3).forEach((doc, index) => {
                            setTimeout(() => {
                                addBotMessage(`\n**Dr. ${doc.doctor}**\n📧 ${doc.online || "N/A"}`);
                              }, index * 300);
                          });
                    }
                }

                setTimeout(() => {
                    addBotMessage("\nHope all is well with you! Take care! 💊");
                    setChatState(ChatState.BYE);
                  }, result.localDoctors ? (Math.min(result.localDoctors.length, 3) * 300 + 500) : 1500);
            } else {
                addBotMessage("Sorry, there was an error finding specialists. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            addBotMessage("Sorry, I'm having trouble connecting right now.");
        }
    };

    const handleQuickReply = async (replyValue) => {
        removeQuickReplies();

        switch (replyValue) {
            case "onConsult":
                addBotMessage("Sure, I'm happy to assist you!\n\nWhat are you feeling right now *in the head and neck area*?\n\nType your response below. The more specific and detailed, the better :)");
                setChatState(ChatState.INPUT_SYMPTOMS);
                break;

            case "onLearn":
                addBotMessage(getAboutMessage());
                showQuickReplies([
                    { label: "Consult my condition", value: "onConsult" },
                    { label: "That's all!", value: "bye" }
                  ]);
                break;

            case "onConfirm":
                addBotMessage("Okay... Now checking.\n\nPlease wait a moment while I analyze your symptoms.");
                await processSymptomAnalysis(userData.symptoms);
                break;

            case "onRetry":
                addBotMessage("My apologies! I'm still learning.\n\nPlease tell me again what you're feeling now?");
                updateUserData({ symptoms: "" });
                setChatState(ChatState.INPUT_SYMPTOMS);
                break;

            case "onRecommendRequest":
                addBotMessage(`Okay. Based on your symptoms, it seems like you might need to consult a **${userData.specialist}**.\n\nWould you like me to recommend a specialist?`);
                showQuickReplies([
                    { label: "Recommend to me", value: "onRecommendRequest" },
                    { label: "I'll check my own", value: "onDismiss" }
                  ]);
                setChatState(ChatState.RESULT_OPTIONS);
                break;

            case "onDismiss":
                addBotMessage("That's good to know. Hope you feel better!\n\nSee that doctor as soon as possible, okay?\n\nThank you for using **Check-App**! Take care! 💊");
                setChatState(ChatState.BYE);
                break;

            case "bye":
                addBotMessage("Thank you for using **Check-App**!\n\nHave a nice day and take care! 💊");
                setChatState(ChatState.BYE);
                break;

            case "onLocationConfirm":
                await processLocation(userData.location);
                break;

            case "onLocationRetry":
                addBotMessage("My apologies! I'm still learning.\n\nPlease tell me again where your location is?");
                setChatState(ChatState.INPUT_LOCATION);
                break;

            default:
                console.warn(`Unhandled reply value: ${replyValue}`);
        }
    };

    const handleSendMessage = async (e) => {
        e?.preventDefault();

        if (!inputValue.trim() && chatState !== ChatState.INPUT_SYMPTOMS && chatState !== ChatState.INPUT_LOCATION) return;

        const message = inputValue.trim();
        if (!message) return;

        addUserMessage(message);
        setInputValue("");

        switch (chatState) {
            case ChatState.CHOICE:
                if (message.toLowerCase().match(/^(hi|hello|hey|hola|good [mae]rning)/)) {
                    addBotMessage("You're back! How can I help you today?");
                    showQuickReplies([
                        { label: "Consult my condition", value: "onConsult" },
                        { label: "Learn about Check-App", value: "onLearn" }
                      ]);
                } else {
                    addBotMessage("I didn't quite catch that. Could you please use the buttons below?\n\nHow can I help you today?");
                    showQuickReplies([
                        { label: "Consult my condition", value: "onConsult" },
                        { label: "Learn about Check-App", value: "onLearn" }
                      ]);
                }
                break;

            case ChatState.INPUT_SYMPTOMS:
                updateUserData((prev) => ({ ...prev, symptoms: prev.symptoms + (prev.symptoms ? "\n" : "") + message }));
                setChatState(ChatState.CONFIRM_SYMPTOMS);

                const newSymptoms = userData.symptoms + (userData.symptoms ? "\n" : "") + message;
                setTimeout(() => {
                    addBotMessage("Ah, I see. This is your message to be checked:\n\n" + newSymptoms);
                    showQuickReplies([
                        { label: "Yes, that is correct", value: "onConfirm" },
                        { label: "Not quite right", value: "onRetry" }
                      ]);
                  }, 500);
                break;

            case ChatState.INPUT_LOCATION:
                updateUserData((prev) => ({ ...prev, location: message }));
                addBotMessage(`Noted on this!\n\nPlease confirm your location:\n**${message}**`);
                showQuickReplies([
                    { label: "Yes it's my location", value: "onLocationConfirm" },
                    { label: "Wrong location", value: "onLocationRetry" }
                  ]);
                break;

            case ChatState.BYE:
                addBotMessage("Thank you for using **Check-App**!\n\nTake care and have a nice day! 💊");
                break;

            default:
                if (message.toLowerCase().match(/^(hi|hello|hey|hola|good [mae]rning)/)) {
                    addBotMessage("You're back! How can I help you today?");
                    showQuickReplies([
                        { label: "Consult my condition", value: "onConsult" },
                        { label: "Learn about Check-App", value: "onLearn" }
                      ]);
                } else if (message.toLowerCase().match(/^(bye|goodbye|see you|thank|thanks)/)) {
                    addBotMessage("Thank you for using **Check-App**!\n\nTake care and have a nice day! 💊");
                    setChatState(ChatState.BYE);
                } else {
                    addBotMessage("I didn't quite catch that. Could you please use the buttons below?\n\nHow can I help you today?");
                    showQuickReplies([
                        { label: "Consult my condition", value: "onConsult" },
                        { label: "Learn about Check-App", value: "onLearn" }
                      ]);
                }
        }
    };

    // Get current quick replies for rendering
    const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
    const showQuickRepliesUI = lastMessage && lastMessage.type === "quick_replies";

    return (
        <div className="flex flex-col h-full">
            {showQuickRepliesUI && (
                <div className="px-4 pb-2">
                    {lastMessage.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleQuickReply(option.value)}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg flex items-center gap-1 mr-2 mb-2"
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}

            <InputArea
                inputValue={inputValue}
                onInputChange={setInputValue}
                onSend={handleSendMessage}
                disabled={isTerminalState(chatState)}
              />
        </div>
    );
};

export default ChatContainer;
