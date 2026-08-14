import React from "react";
import { FormField } from "../../upload/components/FormField";
import { ArtistImageUploader } from "./ArtistImageUploader";
import { Loader2 } from "lucide-react";

interface CreateArtistFormProps {
    formData: {
        name: string;
        bio: string;
        imageFile: File | null;
    };
    setFormData: React.Dispatch<React.SetStateAction<{
        name: string;
        bio: string;
        imageFile: File | null;
    }>>;
    onSubmit: (e: React.FormEvent) => void;
    loading: boolean;
    error: string | null;
}

export const CreateArtistForm: React.FC<CreateArtistFormProps> = ({
    formData,
    setFormData,
    onSubmit,
    loading,
    error,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
    };

    const handleImageChange = (file: File | null) => {
        setFormData((prev) => ({
            ...prev,
            imageFile: file,
        }));
    };

    const isFormValid = formData.name.trim() !== "" && formData.bio.trim() !== "" && formData.imageFile !== null;

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-8">
            {error && (
                <div className="bg-[#1a0f0f] border border-[#331111] text-[#ff8888] px-4 py-3 rounded-md text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Metadata Column */}
                <div className="lg:col-span-7 flex flex-col gap-6 bg-[#171717] p-6 sm:p-8 rounded-xl border border-[#222222]">
                    <div className="flex flex-col gap-1 mb-2">
                        <h3 className="text-lg font-medium text-[#ededed]">Artist Details</h3>
                        <p className="text-[13px] text-[#666666]">Basic metadata for the new artist.</p>
                    </div>

                    <div className="flex flex-col gap-6">
                        <FormField
                            label="Artist Name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. The Weeknd"
                            disabled={loading}
                        />

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="bio" className="text-sm font-medium text-[#888888]">
                                Bio
                            </label>
                            <textarea
                                id="bio"
                                rows={6}
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="A brief description of the artist..."
                                disabled={loading}
                                className="w-full bg-[#161616] border border-[#222222] rounded-md px-3 py-2 text-[#ededed] placeholder:text-[#666666] focus:outline-none focus:ring-1 focus:ring-[#888888] focus:border-[#888888] transition-colors resize-y"
                            />
                        </div>
                    </div>
                </div>

                {/* Media & Action Column */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <div className="flex flex-col gap-6 bg-[#171717] p-6 sm:p-8 rounded-xl border border-[#222222]">
                        <div className="flex flex-col gap-1 mb-2">
                            <h3 className="text-lg font-medium text-[#ededed]">Media</h3>
                            <p className="text-[13px] text-[#666666]">Upload the artist's profile image.</p>
                        </div>

                        <div className="flex flex-col gap-8">
                            <ArtistImageUploader
                                file={formData.imageFile}
                                onChange={handleImageChange}
                            />
                        </div>
                    </div>

                    {/* Action Area */}
                    <button
                        type="submit"
                        disabled={!isFormValid || loading}
                        className={`
                            relative overflow-hidden w-full py-3.5 rounded-lg font-medium text-[14px] transition-all
                            ${!isFormValid || loading
                                ? "bg-[#222222] text-[#666666] cursor-not-allowed border border-[#2a2a2a]"
                                : "bg-[#f0f0f0] text-[#0c0c0c] hover:bg-white"
                            }
                        `}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-[#888888]" />
                                <span className="text-[#aaaaaa]">Creating artist...</span>
                            </div>
                        ) : (
                            "Create Artist"
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
};
