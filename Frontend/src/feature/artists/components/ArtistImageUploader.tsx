import React, { useState, useRef } from "react";
import { Image, X } from "lucide-react";

interface ArtistImageUploaderProps {
    file: File | null;
    onChange: (file: File | null) => void;
}

export const ArtistImageUploader: React.FC<ArtistImageUploaderProps> = ({ file, onChange }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = (selectedFile: File | null) => {
        if (selectedFile) {
            if (!selectedFile.type.startsWith("image/")) return;
            const url = URL.createObjectURL(selectedFile);
            setPreviewUrl(url);
            onChange(selectedFile);
        } else {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            setPreviewUrl(null);
            onChange(null);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        handleFile(droppedFile || null);
    };

    const handleClick = () => {
        if (!file) {
            inputRef.current?.click();
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                    <label className="text-[13px] font-medium text-[#ededed]">Artist Image</label>
                </div>
                <p className="text-[12px] text-[#555555] leading-snug pr-4">
                    A high-quality square image representing the artist.
                </p>
            </div>

            <div
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                    relative w-full max-w-[200px] aspect-square flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition-all cursor-pointer overflow-hidden group
                    ${file 
                        ? "border-[#2a2a2a] bg-[#111111]" 
                        : isDragging 
                            ? "border-[#666666] bg-[#1a1a1a]" 
                            : "border-[#222222] bg-[#141414] hover:bg-[#181818] hover:border-[#333333]"}
                `}
            >
                <input
                    type="file"
                    ref={inputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0] || null)}
                />

                {file && previewUrl ? (
                    <div className="relative w-full h-full group/preview">
                        <img src={previewUrl} alt="Artist preview" className="w-full h-full object-cover transition-transform duration-500 group-hover/preview:scale-105" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/preview:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleFile(null);
                                    if (inputRef.current) inputRef.current.value = '';
                                }}
                                className="p-2.5 bg-[#222222]/90 backdrop-blur-sm rounded-full hover:bg-[#333333] transition-colors text-[#ededed] shadow-lg hover:scale-110 active:scale-95"
                                title="Remove image"
                            >
                                <X className="w-4 h-4" strokeWidth={2} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-[#666666] p-4 text-center gap-3 transition-transform duration-300 group-hover:scale-105">
                        <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                            <Image className="w-5 h-5 text-[#888888]" strokeWidth={1.5} />
                        </div>
                        <span className="text-[12px] font-medium text-[#888888]">Browse or drop image</span>
                    </div>
                )}
            </div>
        </div>
    );
};
