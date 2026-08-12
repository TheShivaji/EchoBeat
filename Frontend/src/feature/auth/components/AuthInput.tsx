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
        <div className="flex flex-col gap-2">
            {label && (
                <label
                    htmlFor={id}
                    className="text-[12px] font-medium text-[#aaaaaa] tracking-[0.05em] uppercase"
                >
                    {label}
                    {required && (
                        <span className="ml-1 text-[#666666]" aria-hidden="true">*</span>
                    )}
                </label>
            )}
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
                    "w-full h-12 px-4 rounded-md text-[14px] font-normal text-[#ededed]",
                    "placeholder:text-[#555555] bg-[#161616] outline-none",
                    "border transition-all duration-200",
                    disabled
                        ? "opacity-40 cursor-not-allowed border-[#1e1e1e]"
                        : error
                        ? "border-[#7a3535] focus:border-[#a04444]"
                        : "border-[#252525] hover:border-[#333333] focus:border-[#484848]",
                ].join(" ")}
            />
            {error && (
                <p
                    id={`${id}-error`}
                    role="alert"
                    className="text-[12.5px] text-[#cc6666] font-normal mt-0.5"
                >
                    {error}
                </p>
            )}
        </div>
    );
};

export default AuthInput;
