import { useState, useRef } from "react";
import { useChatStore } from "../store/useChatStore";

export const MessageInput = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [message, setMessage] = useState("");
  const { sendMessage } = useChatStore();
  const fileInputRef = useRef(null);

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;

      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    const base64 = await fileToBase64(file);
    setImageBase64(base64);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageBase64(null);
    fileInputRef.current.value = null;
  };

  const handleSendMessage = async () => {
    if (!message.trim() && !imageBase64) return;

    try {
      await sendMessage({
        text: message,
        image: imageBase64,
      });

      setMessage("");
      removeImage();
      fileInputRef.current.value = null;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-2 border-t bg-white">
      {imagePreview && (
        <div className="relative w-20 h-20 mb-2">
          <img
            src={imagePreview}
            alt="preview"
            className="w-full h-full rounded-lg object-cover"
          />

          <button
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={() => fileInputRef.current.click()}
          className="px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          📷
        </button>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 grow text-black"
          placeholder="Type a message..."
        />

        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Send
        </button>
      </div>
    </div>
  );
};
