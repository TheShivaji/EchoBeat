import { useState } from "react";
import { useSelector } from "react-redux";
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

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { handleLogin } = useAuth();
    const { loading, error } = useSelector((state: RootState) => state.auth);
const navigate = useNavigate()
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleLogin({ email, password });
        navigate("/")
    };

    return (
        <AuthCard
            heading="Welcome back"
            subheading="Sign in to continue listening."
            footerText="Don't have an account?"
            footerLinkLabel="Create account"
            footerLinkTo="/signup"
        >
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <AuthInput
                    id="login-email"
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

                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                        <label
                            htmlFor="login-password"
                            className="text-[13px] font-medium text-[#a1a1aa]"
                        >
                            Password
                            <span className="ml-0.5 text-[#a78bfa]" aria-hidden="true">*</span>
                        </label>
                        <button
                            type="button"
                            className="text-[12.5px] text-[#a78bfa] hover:text-white transition-colors duration-150 focus:outline-none focus-visible:underline"
                        >
                            Forgot password?
                        </button>
                    </div>
                    <PasswordInput
                        id="login-password"
                        label=""
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        required
                        disabled={loading}
                    />
                </div>

                <div className="pt-1">
                    <AuthButton type="submit" loading={loading} disabled={loading}>
                        Sign In
                    </AuthButton>
                </div>
            </form>
        </AuthCard>
    );
};

export default LoginPage;