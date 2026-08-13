import React, { useState, useRef } from "react";
import { Music, FileAudio, X } from "lucide-react";

interface AudioUploaderProps {
    file: File | null;
    onChange: (file: File | null, duration: number) => void;
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({ file, onChange }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isCalculating, setIsCalculating] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const getAudioDuration = (file: File): Promise<number> => {
        return new Promise((resolve, reject) => {
            const url = URL.createObjectURL(file);
            const audio = new Audio(url);
            
            audio.onloadedmetadata = () => {
                URL.revokeObjectURL(url);
                resolve(Math.round(audio.duration));
            };
            
            audio.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error("Failed to load audio metadata"));
            };
        });
    };

    const handleFile = async (selectedFile: File | null) => {
        if (!selectedFile) {
            onChange(null, 0);
            return;
        }

        if (!selectedFile.type.startsWith("audio/")) return;

        try {
            setIsCalculating(true);
            const durationInSeconds = await getAudioDuration(selectedFile);
            onChange(selectedFile, durationInSeconds);
        } catch (err) {
            console.error("Error reading audio duration", err);
            // Default to 0 if failed, though it shouldn't for valid audio
            onChange(selectedFile, 0);
        } finally {
            setIsCalculating(false);
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

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    return (
        <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-[#ededed]">Audio File</label>
            <p className="text-[12px] text-[#666666] mb-1">Upload the audio track for this song.</p>

            <div
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                    relative w-full min-h-[140px] flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition-all cursor-pointer group
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
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0] || null)}
                />

                {isCalculating ? (
                    <div className="flex flex-col items-center justify-center text-[#888888] gap-3">
                        <Music className="w-6 h-6 animate-pulse text-[#666666]" strokeWidth={1.5} />
                        <span className="text-[13px] font-medium">Processing audio...</span>
                    </div>
                ) : file ? (
                    <div className="flex flex-row items-center justify-between w-full px-6 py-4">
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                            <div className="w-10 h-10 rounded-md bg-[#1e1e1e] border border-[#2a2a2a] flex items-center justify-center shrink-0 group-hover:bg-[#222222] transition-colors">
                                <FileAudio className="w-5 h-5 text-[#cccccc]" strokeWidth={1.5} />
                            </div>
                            <div className="flex flex-col min-w-0 pr-4">
                                <span className="text-[13px] text-[#ededed] font-medium truncate">{file.name}</span>
                                <span className="text-[12px] text-[#888888]">{formatFileSize(file.size)}</span>
                            </div>
                        </div>
                        
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleFile(null);
                                if (inputRef.current) inputRef.current.value = '';
                            }}
                            className="text-[#666666] hover:text-[#ededed] bg-[#1a1a1a] hover:bg-[#222222] border border-[#222222] p-1.5 rounded-md transition-all"
                            title="Remove file"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-1 group-hover:scale-105 transition-transform duration-300">
                            <Music className="w-5 h-5 text-[#888888]" strokeWidth={1.5} />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[13px] font-medium text-[#ededed]">Click to upload or drag and drop</span>
                            <span className="text-[12px] text-[#666666]">MP3, WAV, FLAC</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
