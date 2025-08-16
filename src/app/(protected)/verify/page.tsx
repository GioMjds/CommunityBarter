import { Metadata } from "next";
import VerifyPage from "./verify";

export const metadata: Metadata = {
	title: "Verify your Registration OTP!"
};

export default function Verify() {
	return <VerifyPage />;
}