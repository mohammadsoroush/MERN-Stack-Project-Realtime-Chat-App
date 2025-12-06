import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import useAuthStore from "../store/useAuthStore";

export const Sidebar = () => {
  const { getUser, setSelectedUser, user, selectedUser, isUserLoading } =
    useChatStore();

  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getUser();
  }, [getUser]);

  if (isUserLoading) {
    return (
      <div className="p-4 text-center text-gray-500">Loading users...</div>
    );
  }

  return (
    <div className="w-64 h-full overflow-y-scroll border-r border-gray-200 ">
      <div className="p-4 font-semibold text-lg border-b">Users</div>

      <div className="p-2 space-y-2 overflow-y-auto">
        {user?.map((u) => {
          const isOnline = onlineUsers?.includes(u._id);

          return (
            <div
              key={u._id}
              onClick={() => setSelectedUser(u)}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition
                ${
                  selectedUser?._id === u._id
                    ? "bg-gray-100"
                    : "hover:bg-gray-50"
                }`}
            >
              <div className="relative">
                <img
                  src={u.profilePic || "/default-avatar.png"}
                  alt={u.name}
                  className="w-12 h-12 rounded-full object-cover"
                />

                {isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>

              <div>
                <p className="font-medium text-gray-800">{u.name}</p>
                <p className="text-sm text-gray-500">
                  {isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
