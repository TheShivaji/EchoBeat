import { Music2 } from "lucide-react";
import { Link } from "react-router-dom";

interface AuthCardProps {
    heading: string;
    subheading: string;
    children: React.ReactNode;
    footerText: string;
    footerLinkLabel: string;
    footerLinkTo: string;
}

const AuthCard = ({
    heading,
    subheading,
    children,
    footerText,
    footerLinkLabel,
    footerLinkTo,
}: AuthCardProps) => {
    return (
        <main className="min-h-screen bg-[#0d0d0f] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-[420px]">

                {/* Brand */}
                <div className="flex items-center gap-2 mb-10">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#7c3aed]/15 ring-1 ring-[#7c3aed]/30">
                        <Music2 size={16} className="text-[#a78bfa]" strokeWidth={2} />
                    </div>
                    <span className="text-white text-[15px] font-semibold tracking-tight">
                        EchoBeats
                    </span>
                </div>

                {/* Heading block */}
                <div className="mb-8">
                    <h1 className="text-[26px] font-bold text-white tracking-tight leading-tight">
                        {heading}
                    </h1>
                    <p className="mt-1.5 text-[14px] text-[#71717a]">
                        {subheading}
                    </p>
                </div>

                {/* Form area */}
                <div className="space-y-5">
                    {children}
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 my-7">
                    <div className="flex-1 h-px bg-[#27272a]" />
                    <span className="text-[12px] text-[#52525b] font-medium tracking-wide">or</span>
                    <div className="flex-1 h-px bg-[#27272a]" />
                </div>

                {/* Footer nav */}
                <p className="text-center text-[13.5px] text-[#71717a]">
                    {footerText}{" "}
                    <Link
                        to={footerLinkTo}
                        className="text-[#a78bfa] font-medium hover:text-white transition-colors duration-150 focus:outline-none focus-visible:underline"
                    >
                        {footerLinkLabel}
                    </Link>
                </p>
            </div>
        </main>
    );
};

export default AuthCard;
