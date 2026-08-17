import React from "react";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    id: string;
}

export const FormField: React.FC<FormFieldProps> = ({ label, id, ...props }) => {
    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-sm font-medium text-[#888888]">
                {label}
            </label>
            <input
                id={id}
                className="w-full bg-[#161616] border border-[#222222] rounded-md px-3 py-2 text-[#ededed] placeholder:text-[#666666] focus:outline-none focus:ring-1 focus:ring-[#888888] focus:border-[#888888] transition-colors"
                {...props}
            />
        </div>
    );
};
