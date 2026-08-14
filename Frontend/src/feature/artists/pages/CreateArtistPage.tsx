import React, { useState } from "react";
import { CreateArtistForm } from "../components/CreateArtistForm";
import { useArtists } from "../hook/useArtists";
import {  useNavigate } from "react-router-dom";

export const CreateArtistPage: React.FC = () => {
    const { handleUploadArtist, loading, error } = useArtists();

    const [formData, setFormData] = useState<{
        name: string;
        bio: string;
        imageFile: File | null;
    }>({
        name: "",
        bio: "",
        imageFile: null,
    });

    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name || !formData.bio || !formData.imageFile) {
            return;
        }

        const dataToUpload = {
            name: formData.name,
            bio: formData.bio,
            imageFile: formData.imageFile,
        };

        const response = await handleUploadArtist(dataToUpload);
        
        if (response) {
            navigate("/home")
            // Reset form on success. The hook handles the toast notification.
            setFormData({
                name: "",
                bio: "",
                imageFile: null,
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#0c0c0c] text-[#ededed] py-8 px-6 sm:px-12 md:px-20 lg:px-32">
            <div className="max-w-5xl mx-auto flex flex-col gap-8">
                <header className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-semibold tracking-[0.15em] text-[#666666] uppercase">Admin</span>
                    <h1 className="text-3xl font-semibold tracking-tight text-[#f0f0f0]">Create Artist</h1>
                    <p className="text-[13px] text-[#888888] mt-1">Add a new artist to the EchoBeats library.</p>
                </header>

                <main>
                    <CreateArtistForm
                        formData={formData}
                        setFormData={setFormData}
                        onSubmit={handleSubmit}
                        loading={loading}
                        error={error}
                    />
                </main>
            </div>
        </div>
    );
};

export default CreateArtistPage;
