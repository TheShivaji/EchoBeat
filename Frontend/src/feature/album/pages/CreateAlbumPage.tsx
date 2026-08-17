import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Loader2, Upload, ImageIcon } from "lucide-react";
import { useAlbum } from "../hook/useAlbum";
import { useArtists } from "../../artists/hook/useArtists";
import { FormField } from "../../../components/shared/FormField";
import { ArtistSelector } from "../../upload/components/ArtistSelector";

const CreateAlbumPage = () => {
    const navigate = useNavigate();
    const { createAlbum, loading } = useAlbum();
    const { artists, handleGetAllArtist, loading: loadingArtists } = useArtists();

    const [formData, setFormData] = useState({
        title: "",
        artistId: "",
        releaseYear: new Date().getFullYear().toString(),
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        handleGetAllArtist();
    }, [handleGetAllArtist]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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

        if (!formData.title || !formData.artistId || !formData.releaseYear) {
            toast.error("Please fill in all required fields.");
            return;
        }

        try {
            await createAlbum({
                title: formData.title,
                artistId: formData.artistId,
                releaseYear: parseInt(formData.releaseYear),
                imageFile: imageFile,
            });
            toast.success("Album created successfully!");
            navigate("/albums");
        } catch (error) {
            console.error("Failed to create album:", error);
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
                        Create New Album
                    </h1>
                    <p className="text-[#888888] mt-2 text-sm md:text-base">
                        Add a new album and its cover art to the platform.
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
                                <img src={imagePreview} alt="Album Cover Preview" className="w-full h-full object-cover" />
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
                            id="title"
                            label="Album Title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="e.g. Midnight Memories"
                            required
                        />

                            <ArtistSelector
                                artists={artists}
                                loading={loadingArtists}
                                selectedArtistId={formData.artistId}
                                onChange={(id) => setFormData(prev => ({ ...prev, artistId: id }))}
                                disabled={loading}
                            />

                        <FormField
                            id="year"
                            label="Release Year"
                            name="releaseYear"
                            type="number"
                            value={formData.releaseYear}
                            onChange={handleInputChange}
                            placeholder="e.g. 2024"
                            required
                        />
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
                                    Creating Album...
                                </>
                            ) : (
                                "Create Album"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAlbumPage;
