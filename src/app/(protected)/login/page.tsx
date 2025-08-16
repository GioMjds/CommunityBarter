import { Metadata } from "next"
import LoginPage from "./login";

export const metadata: Metadata = {
	title: "Login"
};

export default function Login() {
	return <LoginPage />;
}