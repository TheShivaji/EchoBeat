import React, { useEffect } from "react";
import { FormField } from "./FormField";
import { AudioUploader } from "./AudioUploader";
import { CoverUploader } from "./CoverUploader";
import type { UploadSongData } from "../types/upload.type";
import { Loader2 } from "lucide-react";
import { ArtistSelector } from "./ArtistSelector";
import { useArtists } from "../../artists/hook/useArtists";

interface UploadSongFormProps {
    formData: Partial<UploadSongData>;
    setFormData: React.Dispatch<React.SetStateAction<Partial<UploadSongData>>>;
    onSubmit: (e: React.FormEvent) => void;
    loading: boolean;
    uploadProgress: number;
    error: string | null;
}

export const UploadSongForm: React.FC<UploadSongFormProps> = ({
    formData,
    setFormData,
    onSubmit,
    loading,
    uploadProgress,
    error,
}) => {
    const { artists, loading: artistsLoading, handleGetAllArtist } = useArtists();

    useEffect(() => {
        handleGetAllArtist();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
    };

    const handleAudioChange = (file: File | null, duration: number) => {
        setFormData((prev) => ({
            ...prev,
            audioFile: file || undefined,
            duration: duration,
        }));
    };

    const handleCoverChange = (file: File | null) => {
        setFormData((prev) => ({
            ...prev,
            imageFile: file || undefined,
        }));
    };

    const isFormValid = formData.title && formData.artistId && formData.category && formData.audioFile;

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
                        <h3 className="text-lg font-medium text-[#ededed]">Song Details</h3>
                        <p className="text-[13px] text-[#666666]">Basic metadata for the new track.</p>
                    </div>

                    <div className="flex flex-col gap-6">
                        <FormField
                            label="Song Title"
                            id="title"
                            value={formData.title || ""}
                            onChange={handleChange}
                            placeholder="e.g. Bohemian Rhapsody"
                            disabled={loading}
                        />
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="flex-1">
                                <ArtistSelector
                                    artists={artists}
                                    loading={artistsLoading}
                                    selectedArtistId={formData.artistId || ""}
                                    onChange={(id) => setFormData(prev => ({ ...prev, artistId: id }))}
                                    disabled={loading}
                                />
                            </div>
                            <div className="flex-1">
                                <FormField
                                    label="Album"
                                    id="albumID"
                                    value={formData.albumID || ""}
                                    onChange={handleChange}
                                    placeholder="Optional album ID"
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        <FormField
                            label="Category"
                            id="category"
                            value={formData.category || ""}
                            onChange={handleChange}
                            placeholder="e.g. Rock, Pop, Jazz"
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* Media & Action Column */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <div className="flex flex-col gap-6 bg-[#171717] p-6 sm:p-8 rounded-xl border border-[#222222]">
                        <div className="flex flex-col gap-1 mb-2">
                            <h3 className="text-lg font-medium text-[#ededed]">Media</h3>
                            <p className="text-[13px] text-[#666666]">Upload audio and artwork.</p>
                        </div>

                        <div className="flex flex-col gap-8">
                            <AudioUploader
                                file={formData.audioFile || null}
                                onChange={handleAudioChange}
                            />
                            
                            <div className="h-px w-full bg-[#222222]"></div>

                            <CoverUploader
                                file={formData.imageFile || null}
                                onChange={handleCoverChange}
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
                                <span className="text-[#aaaaaa]">Uploading song... {uploadProgress}%</span>
                            </div>
                        ) : (
                            "Upload Song"
                        )}

                        {loading && uploadProgress > 0 && (
                            <div
                                className="absolute bottom-0 left-0 h-[3px] bg-[#444444] transition-all duration-300 ease-out"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
};
