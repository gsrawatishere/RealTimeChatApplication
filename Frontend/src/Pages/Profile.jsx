import { useEffect, useState } from "react";
import { Camera, Mail, User } from "lucide-react";
import { axiosInstance } from "../Api/axiosInstance";
import toast from "react-hot-toast";
import sodium from 'libsodium-wrappers';


const Profile = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const [isUpdatingProfile, setisUpdatingProfile] = useState(false);
  const [authUser, setAuthUser] = useState({});
  const [profile,setProfile] = useState();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
   
  const maxSizeInMB = 5; 
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    toast.error('Invalid image format. Please upload JPG, PNG, or WEBP only.');
    return;
  }

  if (file.size > maxSizeInBytes) {
    toast.error("Image too large! Max allowed size is ${maxSizeInMB}MB.")
    return;
  }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  // update profile pic 

  const updateProfile = async (data) => {
    setisUpdatingProfile(true);
    try {

      // encryption 
      await sodium.ready;
      const publicKeyBase64 = localStorage.getItem("publickey");
      
      const encryptedImage = await encryptBase64Image(data.profilePic, publicKeyBase64);
      
      const response = await axiosInstance.put("/auth/update-profile", 
        {profilePic: encryptedImage},
      );

      if (response.status === 200) {
        window.location.reload(); // ✅ Quick refresh 
      }
      toast.success("Profile updated successfully!");
      
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error?.response?.data?.msg || "Failed to update profile!");
    } finally {
      setisUpdatingProfile(false);
    }
  };

 // Encrypt Before sending

const encryptBase64Image = async (base64Image, receiverPublicKeyBase64) => {
  await sodium.ready;

  const publicKey = sodium.from_base64(receiverPublicKeyBase64);
  const message = sodium.from_string(base64Image); 
  const encrypted = sodium.crypto_box_seal(message, publicKey);
  return sodium.to_base64(encrypted); 
};

const decryptBase64Image = async (encryptedBase64, privateKeyBase64, publicKeyBase64) => {
  await sodium.ready;

  const privateKey = sodium.from_base64(privateKeyBase64);
  const publicKey = sodium.from_base64(publicKeyBase64);
  const encryptedBytes = sodium.from_base64(encryptedBase64);

  const decryptedBytes = sodium.crypto_box_seal_open(encryptedBytes, publicKey, privateKey);

  if (!decryptedBytes) {
    throw new Error("Decryption failed. Possibly incorrect keys.");
  }

  // Convert decrypted string (base64) back to image format
  return sodium.to_string(decryptedBytes); // base64 image string
};

// get user details

useEffect(() => {
  const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get("/auth/getUser");
      const userData = response.data.userData;

      // First, store the user data
      setAuthUser(userData);

      // Then, safely access keys for decryption
      const encryptedBase64 = userData.profilePic;
      const privateKeyBase64 = localStorage.getItem("privatekey"); 
      const publicKeyBase64 =  localStorage.getItem("publickey");

  
      if (!encryptedBase64 || !privateKeyBase64 || !publicKeyBase64) {
        console.warn("Missing encryption keys or image");
        return;
      }

      const decryptedBase64 = await decryptBase64Image(
        encryptedBase64,
        privateKeyBase64,
        publicKeyBase64
      );

      setProfile(decryptedBase64);
    } catch (error) {
      console.error("Error fetching or decrypting user data:", error);
    }
  };

  fetchUserData();
}, []);

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* Avatar upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={ profile || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4"
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* User Info */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.fullName}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.email}
              </p>
            </div>
          </div>

          {/* Extra Info */}
          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.registeredAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;