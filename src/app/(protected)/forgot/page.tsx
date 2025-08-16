import { Metadata } from "next";
import ForgotPasswordPage from "./forgot";

export const metadata: Metadata = {
    title: "Forgot Password"
};

export default function ForgotPassword() {
    return <ForgotPasswordPage />;
}