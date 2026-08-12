// ─── SectionHeader ────────────────────────────────────────────────────────────

interface SectionHeaderProps {
    title: string;
    action?: React.ReactNode;
}

const SectionHeader = ({ title, action }: SectionHeaderProps) => (
    <div className="flex items-end justify-between mb-5">
        <h2 className="text-[18px] font-semibold text-[#ededed] tracking-[-0.01em]">
            {title}
        </h2>
        {action && (
            <span className="text-[12px] font-medium text-[#666666] hover:text-[#aaaaaa] transition-colors duration-150 cursor-pointer">
                {action}
            </span>
        )}
    </div>
);

export default SectionHeader;
