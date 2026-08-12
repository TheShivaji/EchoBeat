import { Loader2 } from "lucide-react";

interface AuthButtonProps {
    children: React.ReactNode;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    loading?: boolean;
    onClick?: () => void;
}

const AuthButton = ({
    children,
    type = "button",
    disabled = false,
    loading = false,
    onClick,
}: AuthButtonProps) => {
    const isDisabled = disabled || loading;

    return (
        <button
            type={type}
            disabled={isDisabled}
            onClick={onClick}
            className={[
                "w-full h-12 flex items-center justify-center gap-2.5",
                "rounded-md text-[13.5px] font-medium tracking-[0.01em]",
                "bg-[#f0f0f0] text-[#0c0c0c]",
                "transition-all duration-150",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f0f0f0]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c0c0c]",
                isDisabled
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-white active:scale-[0.985] active:bg-[#e8e8e8]",
            ].join(" ")}
        >
            {loading && (
                <Loader2
                    size={14}
                    strokeWidth={2}
                    className="animate-spin text-[#0c0c0c]/50"
                    aria-hidden="true"
                />
            )}
            {children}
        </button>
    );
};

export default AuthButton;
