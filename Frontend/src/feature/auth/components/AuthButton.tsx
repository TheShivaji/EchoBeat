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
                "w-full h-11 flex items-center justify-center gap-2",
                "rounded-lg text-[14px] font-semibold text-white",
                "bg-[#7c3aed] transition-all duration-150",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7c3aed]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d0f]",
                isDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-[#6d28d9] active:scale-[0.985]",
            ].join(" ")}
        >
            {loading && (
                <Loader2
                    size={16}
                    strokeWidth={2.5}
                    className="animate-spin text-white/70"
                    aria-hidden="true"
                />
            )}
            {children}
        </button>
    );
};

export default AuthButton;
