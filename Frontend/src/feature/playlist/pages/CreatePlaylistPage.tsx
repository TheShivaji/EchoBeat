import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Loader2, Upload, ImageIcon } from "lucide-react";
import { usePlaylist } from "../hook/usePlaylist";
import { FormField } from "../../../components/shared/FormField";

const CreatePlaylistPage = () => {
    const navigate = useNavigate();
    const { createPlaylist, loading } = usePlaylist();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        isPublic: false,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name) {
            toast.error("Please provide a name for your playlist.");
            return;
        }

        try {
            await createPlaylist({
                name: formData.name,
                description: formData.description,
                isPublic: formData.isPublic,
                imageFile: imageFile,
            });
            toast.success("Playlist created successfully!");
            navigate("/"); // Or navigate to /my-playlists if that page existed
        } catch (error) {
            console.error("Failed to create playlist:", error);
        }
    };

    return (
        <div className="min-h-screen bg-[#0c0c0c] px-4 md:px-10 lg:px-12 py-8 md:py-10 pb-28 md:pb-10 flex justify-center">
            <div className="w-full max-w-2xl">
                <header className="mb-10 text-center md:text-left">
                    <h1
                        className="text-[28px] md:text-[40px] font-normal text-[#ededed] leading-tight tracking-[-0.02em]"
                        style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
                    >
                        Create Playlist
                    </h1>
                    <p className="text-[#888888] mt-2 text-sm md:text-base">
                        Create a new playlist and share your vibe.
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="bg-[#121212] border border-[#222] rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">

                    {/* Cover Image Upload Area */}
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <label
                            htmlFor="image-upload"
                            className="relative cursor-pointer group w-48 h-48 rounded-xl overflow-hidden bg-[#1a1a1a] border-2 border-dashed border-[#333] hover:border-[#666] flex items-center justify-center transition-all duration-300"
                        >
                            {imagePreview ? (
                                <img src={imagePreview} alt="Playlist Cover Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center space-y-2 text-[#666] group-hover:text-[#999]">
                                    <ImageIcon size={40} />
                                    <span className="text-sm font-medium">Upload Cover</span>
                                </div>
                            )}

                            {/* Hover overlay for changing image */}
                            {imagePreview && (
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Upload className="text-white" size={24} />
                                </div>
                            )}
                            <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </label>
                        <p className="text-xs text-[#666]">Recommended: Square image, max 5MB</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <FormField
                            id="name"
                            label="Playlist Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="e.g. Late Night Drives"
                            required
                        />

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-[#cccccc]">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Add an optional description"
                                rows={3}
                                className="w-full bg-[#1a1a1a] border border-[#333333] text-[#ededed] px-4 py-3 rounded-xl focus:outline-none focus:border-[#666666] focus:ring-1 focus:ring-[#666666] transition-all resize-none"
                            />
                        </div>

                        <div className="flex items-center space-x-3 bg-[#1a1a1a] p-4 rounded-xl border border-[#333]">
                            <input
                                type="checkbox"
                                id="isPublic"
                                name="isPublic"
                                checked={formData.isPublic}
                                onChange={handleInputChange}
                                className="w-5 h-5 accent-white cursor-pointer"
                            />
                            <div className="flex flex-col">
                                <label htmlFor="isPublic" className="text-sm font-medium text-[#ededed] cursor-pointer">
                                    Make Public
                                </label>
                                <span className="text-xs text-[#888888]">
                                    Allow anyone on EchoBeat to listen to this playlist.
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black font-semibold py-3.5 px-4 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating Playlist...
                                </>
                            ) : (
                                "Create Playlist"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePlaylistPage;
