import { useState } from "react";
import { useSelector } from "react-redux";
import { ShieldCheck, User } from "lucide-react";
import { useAuth } from "../hook/authUse";
import AuthCard from "../components/AuthCard";
import AuthInput from "../components/AuthInput";
import PasswordInput from "../components/PasswordInput";
import AuthButton from "../components/AuthButton";
import { useNavigate } from "react-router-dom";

interface RootState {
    auth: {
        loading: boolean;
        error: string | null;
    };
}

type Role = "USER" | "ADMIN";

const ROLES: { value: Role; label: string; description: string; icon: React.ReactNode }[] = [
    {
        value: "USER",
        label: "Listener",
        description: "Stream and enjoy music",
        icon: <User size={15} strokeWidth={2} />,
    },
    {
        value: "ADMIN",
        label: "Admin",
        description: "Manage content and users",
        icon: <ShieldCheck size={15} strokeWidth={2} />,
    },
];

const SignupPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState<Role>("USER");

    const navigate = useNavigate()
    const { handleSignup } = useAuth();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) return;
        try {
            await handleSignup({ name, email, password, role });
            navigate('/')

        } catch (err) {
            console.log("Error in signup", err);
        }
    };

    const passwordMismatch =
        confirmPassword.length > 0 && password !== confirmPassword;

    return (
        <AuthCard
            heading="Create your account"
            subheading="Start your music journey."
            footerText="Already have an account?"
            footerLinkLabel="Sign in"
            footerLinkTo="/login"
        >
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Role selector */}
                <div className="flex flex-col gap-1.5">
                    <span className="text-[13px] font-medium text-[#a1a1aa]">
                        Account type
                        <span className="ml-0.5 text-[#a78bfa]" aria-hidden="true">*</span>
                    </span>
                    <div className="grid grid-cols-2 gap-2.5" role="radiogroup" aria-label="Account type">
                        {ROLES.map((r) => {
                            const isSelected = role === r.value;
                            return (
                                <button
                                    key={r.value}
                                    type="button"
                                    role="radio"
                                    aria-checked={isSelected}
                                    disabled={loading}
                                    onClick={() => setRole(r.value)}
                                    className={[
                                        "flex flex-col items-start gap-1 px-3.5 py-3 rounded-lg border text-left",
                                        "transition-all duration-150 focus:outline-none",
                                        "focus-visible:ring-2 focus-visible:ring-[#7c3aed]/50",
                                        loading ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
                                        isSelected
                                            ? "border-[#7c3aed]/60 bg-[#7c3aed]/10"
                                            : "border-[#27272a] bg-[#18181b] hover:border-[#3f3f46]",
                                    ].join(" ")}
                                >
                                    <span className={[
                                        "flex items-center gap-1.5 text-[13px] font-semibold",
                                        isSelected ? "text-[#a78bfa]" : "text-[#a1a1aa]",
                                    ].join(" ")}>
                                        {r.icon}
                                        {r.label}
                                    </span>
                                    <span className="text-[11.5px] text-[#52525b] leading-tight">
                                        {r.description}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <AuthInput
                    id="signup-name"
                    label="Name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    autoComplete="name"
                    required
                    disabled={loading}
                />

                <AuthInput
                    id="signup-email"
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    disabled={loading}
                    error={error ?? undefined}
                />

                <PasswordInput
                    id="signup-password"
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                    disabled={loading}
                />

                <PasswordInput
                    id="signup-confirm-password"
                    label="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                    disabled={loading}
                    error={passwordMismatch ? "Passwords do not match" : undefined}
                />

                <div className="pt-1">
                    <AuthButton
                        type="submit"
                        loading={loading}
                        disabled={loading || passwordMismatch}
                    >
                        Create Account
                    </AuthButton>
                </div>
            </form>
        </AuthCard>
    );
};

export default SignupPage;