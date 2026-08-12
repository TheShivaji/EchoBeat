

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
}

export interface SignupUser {
    name: string;
    email: string;
    password: string;
    role: "USER" | "ADMIN";
}

export interface LoginUser {
    email: string;
    password: string;
}

export interface AuthApiResponse {
    success: boolean;
    user: User;
    message: string;
}


