import React from "react";
import { motion } from "framer-motion";

export interface LoaderProps {
    /** 
     * Determines the physical size of the loader
     * @default "md"
     */
    size?: "sm" | "md" | "lg";
    
    /** 
     * Determines the color variant.
     * primary = EchoBeats Green (#1db954)
     * neutral = Primary Text Color (#ededed)
     * dark = Dark Color for light backgrounds (#121212)
     * @default "primary"
     */
    variant?: "primary" | "neutral" | "dark";
    
    /** Optional text to display below the loader */
    text?: string;
    
    /** Additional container classes */
    className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ 
    size = "md", 
    variant = "primary", 
    text,
    className = ""
}) => {
    // Sizing map for responsive/flexible usage
    const sizeConfig = {
        sm: {
            barWidth: "w-1",
            barHeight: "h-4",
            containerGap: "gap-1",
            textSize: "text-xs",
        },
        md: {
            barWidth: "w-1.5",
            barHeight: "h-6",
            containerGap: "gap-1.5",
            textSize: "text-sm",
        },
        lg: {
            barWidth: "w-2",
            barHeight: "h-8",
            containerGap: "gap-2",
            textSize: "text-base",
        }
    };

    // Colors matching the existing EchoBeats theme
    const colorConfig = {
        primary: "bg-[#1db954]",
        neutral: "bg-[#ededed]",
        dark: "bg-[#121212]"
    };

    const s = sizeConfig[size];
    const c = colorConfig[variant];

    return (
        <div 
            className={`flex flex-col items-center justify-center ${className}`} 
            role="status" 
            aria-label="Loading"
        >
            {/* Audio Waveform Animation Container */}
            <div className={`flex items-end ${s.containerGap} ${s.barHeight}`}>
                {[0, 1, 2, 3].map((index) => (
                    <motion.div
                        key={index}
                        className={`${s.barWidth} ${s.barHeight} ${c} rounded-full origin-bottom`}
                        animate={{
                            scaleY: [0.3, 1, 0.3],
                            opacity: [0.4, 1, 0.4],
                        }}
                        transition={{
                            delay: index * 0.15,
                            duration: 1,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>
            
            {/* Optional Loading Text */}
            {text && (
                <p className={`mt-3 font-medium text-[#888888] ${s.textSize} animate-pulse`}>
                    {text}
                </p>
            )}
            
            {/* Screen reader only text for accessibility */}
            <span className="sr-only">{text || "Loading..."}</span>
        </div>
    );
};
