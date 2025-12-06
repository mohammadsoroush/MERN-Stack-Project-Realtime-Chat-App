import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { ChatHeader } from "./ChatHeader";
import { MessageInput } from "./MessageInput";
import useAuthStore from "../store/useAuthStore";
import { useRef } from "react";

export const ChatContainer = () => {
  const messageEndRef = useRef(null);
  const {
    messages,
    getMessages,
    isMessageLoading,
    selectedUser,
    subscribeMessageFromSocket,
    unsubscribeMessageFromSocket,
  } = useChatStore();

  const scrollToEnd = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const { authUser } = useAuthStore();

  useEffect(() => {
    scrollToEnd();
  }, [messages]);

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
      subscribeMessageFromSocket();
    }
    return () => {
      unsubscribeMessageFromSocket();
    };
  }, [
    selectedUser,
    getMessages,
    subscribeMessageFromSocket,
    unsubscribeMessageFromSocket,
  ]);

  if (!authUser) return null;

  if (isMessageLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((message) => {
          const isMe = message.senderId === authUser._id;

          return (
            <div
              key={message._id}
              className={`chat ${isMe ? "chat-end" : "chat-start"}`}
            >
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    src={isMe ? authUser.profilePic : selectedUser.profilePic}
                    alt="avatar"
                  />
                </div>
              </div>

              <div>
                {message.image && (
                  <div className="chat-bubble p-0 max-w-xs overflow-hidden mb-1 text-end">
                    <img
                      src={message.image}
                      className="rounded-lg w-full"
                      alt="sent-image"
                    />
                  </div>
                )}

                {message.text && (
                  <div className="chat-bubble text-end">{message.text}</div>
                )}

                <div className="chat-footer opacity-50 text-xs mt-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};
