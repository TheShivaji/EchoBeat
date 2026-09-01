import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../app/app.store";
import { setUser } from "../../auth/state/authSlice";
import { updateProfileApi, changePasswordApi } from "../api/profile.api";
import { FormField } from "../../../components/shared/FormField";
import { toast } from "react-hot-toast";
import { User as UserIcon, Lock, Upload } from "lucide-react";
import { Loader } from "../../../components/shared/Loader";
import axios from "axios";

const ProfilePage = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();

    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const [profileData, setProfileData] = useState({
        username: ""
    });
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                username: user.username || ""
            });
            setAvatarPreview(user.avatarUrl || null);
        }
    }, [user]);

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfileData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdatingProfile(true);
        try {
            const formData = new FormData();
            formData.append("username", profileData.username);
            if (avatarFile) {
                formData.append("avatar", avatarFile);
            }

            const res = await updateProfileApi(formData);
            if (res.success) {
                dispatch(setUser(res.user));
                toast.success("Profile updated successfully!");
                setAvatarFile(null); // Clear selected file after successful upload
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Failed to update profile");
            }
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error("New passwords do not match");
        }

        if (passwordData.newPassword.length < 6) {
            return toast.error("New password must be at least 6 characters");
        }

        setIsChangingPassword(true);
        try {
            const res = await changePasswordApi({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            if (res.success) {
                toast.success("Password changed successfully!");
                setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Failed to change password");
            }
        } finally {
            setIsChangingPassword(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#0c0c0c] px-4 md:px-8 lg:px-12 py-10 md:py-12 pb-32 flex justify-center">
            <div className="w-full max-w-3xl space-y-10">
                <header className="mb-4">
                    <h1
                        className="text-[32px] md:text-[46px] font-normal text-[#ededed] leading-tight tracking-[-0.02em]"
                        style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
                    >
                        My Profile
                    </h1>
                    <p className="text-[#888888] mt-2 text-sm md:text-[15px]">
                        Manage your account settings and preferences.
                    </p>
                </header>

                {/* Profile Form */}
                <form onSubmit={handleProfileSubmit} className="bg-[#121212] border border-[#1e1e1e] rounded-2xl p-6 md:p-10 shadow-xl">
                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-[#1e1e1e]">
                        <UserIcon className="text-[#a3a3a3]" size={22} />
                        <h2 className="text-lg md:text-xl font-semibold text-[#ededed]">Public Profile</h2>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-start">
                        {/* Avatar Preview */}
                        <div className="flex flex-col items-center gap-3 shrink-0 mx-auto md:mx-0">
                            <label
                                htmlFor="avatar-upload"
                                className="relative cursor-pointer group w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-[#1a1a1a] border border-[#333] flex items-center justify-center shadow-inner"
                            >
                                {avatarPreview ? (
                                    <img 
                                        src={avatarPreview} 
                                        alt="Avatar Preview" 
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src = ""; // Fallback if image fails to load
                                        }}
                                    />
                                ) : (
                                    <UserIcon size={48} className="text-[#444]" />
                                )}

                                {/* Hover overlay for changing image */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Upload className="text-white" size={24} />
                                </div>
                                <input
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                />
                            </label>
                            <span className="text-xs font-medium text-[#666] uppercase tracking-wider">Change Avatar</span>
                        </div>

                        <div className="w-full space-y-6 flex-1">
                            <FormField
                                id="username"
                                name="username"
                                label="Display Name"
                                value={profileData.username}
                                onChange={handleProfileChange}
                                placeholder="e.g. John Doe"
                                required
                            />
                            
                            <div className="pt-2 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isUpdatingProfile}
                                    className="w-full md:w-auto bg-white text-black font-semibold py-3 px-8 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                                >
                                    {isUpdatingProfile ? (
                                        <>
                                            <Loader size="sm" variant="neutral" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Save Profile"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Password Form */}
                <form onSubmit={handlePasswordSubmit} className="bg-[#121212] border border-[#1e1e1e] rounded-2xl p-6 md:p-10 shadow-xl">
                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-[#1e1e1e]">
                        <Lock className="text-[#a3a3a3]" size={22} />
                        <h2 className="text-lg md:text-xl font-semibold text-[#ededed]">Security Settings</h2>
                    </div>

                    <div className="space-y-6">
                        {user.password && (
                            <div className="pb-6 mb-6 border-b border-[#1e1e1e]/50">
                                <div className="max-w-md">
                                    <FormField
                                        id="currentPassword"
                                        name="currentPassword"
                                        type="password"
                                        label="Current Password"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                label="New Password"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                placeholder="••••••••"
                                required
                            />

                            <FormField
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                label="Confirm Password"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={isChangingPassword}
                                className="w-full md:w-auto bg-[#1db954] text-black font-semibold py-3 px-8 rounded-xl hover:bg-[#1ed760] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                            >
                                {isChangingPassword ? (
                                    <>
                                        <Loader size="sm" variant="neutral" />
                                        Updating...
                                    </>
                                ) : (
                                    "Update Password"
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
