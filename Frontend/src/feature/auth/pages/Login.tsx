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
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await handleLogin({ email, password });
        if (success) {
            navigate("/");
        }
    };

    return (
        <AuthCard
            heading="Welcome back"
            subheading="Sign in to continue listening."
            footerText="Don't have an account?"
            footerLinkLabel="Create one"
            footerLinkTo="/register"
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

                {/* Password with inline forgot */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <label
                            htmlFor="login-password"
                            className="text-[12px] font-medium text-[#aaaaaa] tracking-[0.05em] uppercase"
                        >
                            Password
                            <span className="ml-1 text-[#666666]" aria-hidden="true">*</span>
                        </label>
                        <button
                            type="button"
                            className="text-[12px] text-[#777777] hover:text-[#c0c0c0] transition-colors duration-150 focus:outline-none focus-visible:underline font-normal"
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

                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[#333333]"></div>
                    </div>
                    <div className="relative flex justify-center text-[11px] uppercase tracking-widest font-medium">
                        <span className="bg-[#111111] px-2 text-[#888888]">Or continue with</span>
                    </div>
                </div>

                <a 
                    href="http://localhost:5000/api/user/google" 
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md text-[13px] font-medium text-[#ffffff] bg-[#222222] border border-[#333333] hover:bg-[#333333] hover:border-[#444444] transition-all duration-150"
                >
                    <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        <path d="M1 1h22v22H1z" fill="none"/>
                    </svg>
                    Google
                </a>

                <div className="pt-2">
                    <AuthButton type="submit" loading={loading} disabled={loading}>
                        Sign in
                    </AuthButton>
                </div>
            </form>
        </AuthCard>
    );
};

export default LoginPage;