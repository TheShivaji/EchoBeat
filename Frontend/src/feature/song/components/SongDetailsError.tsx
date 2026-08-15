interface SongDetailsErrorProps {
    message?: string;
}

const SongDetailsError = ({ message = "Unable to load song" }: SongDetailsErrorProps) => {
    return (
        <div className="min-h-screen bg-[#0c0c0c] flex flex-col items-center justify-center px-6">
            <h2 className="text-[#ededed] text-xl font-medium mb-2">Something went wrong</h2>
            <p className="text-[#888888] text-sm text-center max-w-md">
                {message}
            </p>
        </div>
    );
};

export default SongDetailsError;
