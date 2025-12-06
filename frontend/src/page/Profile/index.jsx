import { useState } from "react";
import useAuthStore from "../../store/useAuthStore";

const Profile = () => {
  const { updateProfile, authUser, isUpdatingProfile } = useAuthStore();

  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(authUser?.profilePic || null);

  // وقتی عکس انتخاب می‌شود → Preview بساز
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedImage(file);
    setPreview(URL.createObjectURL(file)); // نمایش عکس
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUpdateProfile = async () => {
    if (!selectedImage) return;

    const base64 = await fileToBase64(selectedImage);

    await updateProfile({ profilePic: base64 });
  };

  return (
    <div className="max-w-md mx-auto mt-10  p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Update Profile</h2>

      {/* عکس پروفایل */}
      <div className="flex flex-col items-center gap-4">
        <img
          src={preview || "/default-avatar.png"}
          alt="profile"
          className="w-32 h-32 rounded-full object-cover border"
        />

        <label className="btn btn-outline btn-sm cursor-pointer">
          Select Image
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </label>

        <button
          disabled={isUpdatingProfile || !selectedImage}
          onClick={handleUpdateProfile}
          className="btn btn-primary w-full"
        >
          {isUpdatingProfile ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </div>
  );
};

export default Profile;
