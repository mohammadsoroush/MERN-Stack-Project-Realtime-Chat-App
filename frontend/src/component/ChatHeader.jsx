import { X } from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

export const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();

  const { onlineUsers } = useAuthStore();

  if (!selectedUser) return null;

  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="flex items-center justify-between p-3 border-b bg-base-200">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Profile Picture */}
        <div className="relative">
          <img
            src={selectedUser.profilePic || "/default-profile.png"}
            alt={selectedUser.fullName}
            className="w-10 h-10 rounded-full object-cover"
          />

          {/* Online / Offline Dot */}
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-base-200
              ${isOnline ? "bg-green-500" : "bg-gray-400"}
            `}
          ></span>
        </div>

        {/* Name + Status */}
        <div className="flex flex-col">
          <span className="font-semibold">{selectedUser.fullName}</span>
          <span className="text-xs opacity-70">
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={() => setSelectedUser(null)}
        className="p-2 hover:bg-base-300 rounded-full transition"
      >
        <X size={20} />
      </button>
    </div>
  );
};
