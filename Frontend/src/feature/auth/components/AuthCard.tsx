import { Disc3 } from "lucide-react";
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
        <main className="min-h-screen bg-[#0c0c0c] flex items-center justify-center px-5 py-16">
            <div className="w-full max-w-[400px]">

                {/* Brand mark */}
                <div className="flex items-center gap-2.5 mb-14">
                    <Disc3
                        size={17}
                        strokeWidth={1.5}
                        className="text-[#c8c8c8] shrink-0"
                        aria-hidden="true"
                    />
                    <span className="text-[#c8c8c8] text-[13px] font-medium tracking-[0.1em] uppercase">
                        EchoBeats
                    </span>
                </div>

                {/* Display heading */}
                <div className="mb-10">
                    <h1
                        className="text-[34px] font-normal text-[#ededed] leading-[1.2] tracking-[-0.02em]"
                        style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
                    >
                        {heading}
                    </h1>
                    <p className="mt-3 text-[14px] text-[#999999] leading-relaxed font-normal">
                        {subheading}
                    </p>
                </div>

                {/* Form content */}
                <div>
                    {children}
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 my-8">
                    <div className="flex-1 h-px bg-[#222222]" />
                    <span className="text-[11px] text-[#555555] font-medium tracking-widest uppercase">
                        or
                    </span>
                    <div className="flex-1 h-px bg-[#222222]" />
                </div>

                {/* Footer */}
                <p className="text-center text-[13.5px] text-[#888888] font-normal">
                    {footerText}{" "}
                    <Link
                        to={footerLinkTo}
                        className="text-[#c8c8c8] font-medium underline underline-offset-4 decoration-[#444444] hover:text-[#ededed] hover:decoration-[#888888] transition-all duration-200 focus:outline-none focus-visible:text-white"
                    >
                        {footerLinkLabel}
                    </Link>
                </p>
            </div>
        </main>
    );
};

export default AuthCard;
