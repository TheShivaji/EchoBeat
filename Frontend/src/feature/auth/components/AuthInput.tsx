interface AuthInputProps {
    id: string;
    label: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    autoComplete?: string;
}

const AuthInput = ({
    id,
    label,
    type = "text",
    value,
    onChange,
    placeholder,
    error,
    disabled = false,
    required = false,
    autoComplete,
}: AuthInputProps) => {
    return (
        <div className="flex flex-col gap-1.5">
            <label
                htmlFor={id}
                className="text-[13px] font-medium text-[#a1a1aa]"
            >
                {label}
                {required && (
                    <span className="ml-0.5 text-[#a78bfa]" aria-hidden="true">*</span>
                )}
            </label>
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                autoComplete={autoComplete}
                aria-describedby={error ? `${id}-error` : undefined}
                aria-invalid={error ? true : undefined}
                className={[
                    "w-full h-11 px-3.5 rounded-lg text-[14px] text-white placeholder:text-[#3f3f46]",
                    "bg-[#18181b] border transition-all duration-150 outline-none",
                    "focus:ring-2 focus:ring-[#7c3aed]/40 focus:border-[#7c3aed]/60",
                    "hover:border-[#3f3f46]",
                    disabled
                        ? "opacity-40 cursor-not-allowed border-[#27272a]"
                        : error
                        ? "border-red-500/60 focus:ring-red-500/30 focus:border-red-500/60"
                        : "border-[#27272a]",
                ].join(" ")}
            />
            {error && (
                <p
                    id={`${id}-error`}
                    role="alert"
                    className="text-[12px] text-red-400 mt-0.5"
                >
                    {error}
                </p>
            )}
        </div>
    );
};

export default AuthInput;
