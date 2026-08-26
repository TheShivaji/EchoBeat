// ─── SectionHeader ────────────────────────────────────────────────────────────

interface SectionHeaderProps {
    title: string;
    action?: React.ReactNode;
}

const SectionHeader = ({ title, action }: SectionHeaderProps) => (
    <div className="flex items-end justify-between mb-4 mt-2">
        <h2 className="text-xl md:text-2xl font-bold text-[#ededed] tracking-tight">
            {title}
        </h2>
        {action && (
            <span className="text-[13px] font-medium text-[#888888] hover:text-[#ffffff] transition-colors duration-300 ease-out cursor-pointer uppercase tracking-wider">
                {action}
            </span>
        )}
    </div>
);

export default SectionHeader;
