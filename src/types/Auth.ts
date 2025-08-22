export interface ApiResponse<T = any> {
    message?: string;
    error?: string;
    data?: T;
}

export interface OtpVerifyResponse {
    message: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
    };
}

export interface RegisterOtpResponse {
    message: string;
    firstName: string;
    lastName: string;
    otp: string;
}

export interface ResendOtpResponse {
    message: string;
}

export interface CompleteProfileResponse {
    message: string;
    user: {
        id: string;
        name: string;
        email: string;
        username: string;
        age: number;
        contact_number: string;
        profileImage: string;
    };
}