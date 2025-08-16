import { Metadata } from "next";
import RegisterPage from "./register";

export const metadata: Metadata = {
	title: "Register"
};

export default function Register() {
	return <RegisterPage />;
}