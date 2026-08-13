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
        icon: <User size={14} strokeWidth={1.75} />,
    },
    {
        value: "ADMIN",
        label: "Admin",
        description: "Manage content & users",
        icon: <ShieldCheck size={14} strokeWidth={1.75} />,
    },
];

const SignupPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState<Role>("USER");

    const navigate = useNavigate();
    const { handleSignup } = useAuth();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) return;
        try {
            const success = await handleSignup({ name, email, password, role });
            if (success) {
                navigate("/");
            }
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

                {/* Account type selector */}
                <div className="flex flex-col gap-2.5">
                    <span className="text-[12px] font-medium text-[#aaaaaa] tracking-[0.05em] uppercase">
                        Account type
                        <span className="ml-1 text-[#666666]" aria-hidden="true">*</span>
                    </span>
                    <div
                        className="grid grid-cols-2 gap-2.5"
                        role="radiogroup"
                        aria-label="Account type"
                    >
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
                                        "flex items-center gap-3 px-4 py-3.5 rounded-md border text-left",
                                        "transition-all duration-150 focus:outline-none",
                                        "focus-visible:ring-1 focus-visible:ring-[#444444]",
                                        loading ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
                                        isSelected
                                            ? "border-[#444444] bg-[#1a1a1a]"
                                            : "border-[#222222] bg-[#131313] hover:border-[#333333] hover:bg-[#161616]",
                                    ].join(" ")}
                                >
                                    <span className={[
                                        "shrink-0 transition-colors duration-150",
                                        isSelected ? "text-[#c8c8c8]" : "text-[#666666]",
                                    ].join(" ")}>
                                        {r.icon}
                                    </span>
                                    <span className="flex flex-col gap-1 min-w-0">
                                        <span className={[
                                            "text-[13px] font-medium leading-none",
                                            isSelected ? "text-[#ededed]" : "text-[#888888]",
                                        ].join(" ")}>
                                            {r.label}
                                        </span>
                                        <span className="text-[11px] text-[#555555] leading-tight truncate">
                                            {r.description}
                                        </span>
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

                <div className="pt-2">
                    <AuthButton
                        type="submit"
                        loading={loading}
                        disabled={loading || passwordMismatch}
                    >
                        Create account
                    </AuthButton>
                </div>
            </form>
        </AuthCard>
    );
};

export default SignupPage;