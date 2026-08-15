import React, { useState } from "react";
import { UploadSongForm } from "../components/UploadSongForm";
import type { UploadSongData } from "../types/upload.type";
import { handleupload as useUpload } from "../hook/useUpload";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const UploadPage: React.FC = () => {
    const { uploadSong, loading, error, uploadprogres } = useUpload();
    const navigate = useNavigate();
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState<Partial<UploadSongData>>({
        title: "",
        artistId: "",
        albumID: "",
        category: "",
        duration: 0,
        audioFile: undefined,
        imageFile: undefined,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.title || !formData.artistId || !formData.category || !formData.audioFile || typeof formData.duration !== 'number') {
            return;
        }

        const dataToUpload: UploadSongData = {
            title: formData.title,
            artistId: formData.artistId,
            category: formData.category,
            audioFile: formData.audioFile,
            duration: formData.duration,
            albumID: formData.albumID || undefined,
            imageFile: formData.imageFile || undefined,
        };

        const response = await uploadSong(dataToUpload);
        
        if (response) {
            setSuccess(true);
            // Hide success message and navigate after 1.5 seconds
            setTimeout(() => {
                navigate("/");
            }, 1500);
        }
    };

    return (
        <div className="min-h-screen bg-[#0c0c0c] text-[#ededed] py-8 px-6 sm:px-12 md:px-20 lg:px-32">
            <div className="max-w-5xl mx-auto flex flex-col gap-8">
                <header className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-semibold tracking-[0.15em] text-[#666666] uppercase">Admin</span>
                    <h1 className="text-3xl font-semibold tracking-tight text-[#f0f0f0]">Upload Song</h1>
                    <p className="text-[13px] text-[#888888] mt-1">Add a new track to the EchoBeats library.</p>
                </header>

                {success && (
                    <div className="bg-[#111111] border border-[#222222] rounded-md py-3 px-4 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="text-[#f0f0f0] w-4 h-4" />
                            <span className="text-[13px] font-medium text-[#ededed]">Song uploaded successfully.</span>
                        </div>
                        <span className="text-[12px] text-[#888888]">Ready for another track.</span>
                    </div>
                )}

                <main>
                    <UploadSongForm
                        formData={formData}
                        setFormData={setFormData}
                        onSubmit={handleSubmit}
                        loading={loading}
                        error={error}
                        uploadProgress={uploadprogres}
                    />
                </main>
            </div>
        </div>
    );
};

export default UploadPage;
