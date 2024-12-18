import ForgotPasswordForm from "@/forms/forgot-password/ForgotPasswordForm";
import AuthLayout from "@/layouts/layout";

export default function ForgotPassword() {
  return (
    <AuthLayout pageTitle={"Log in to continue"}>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
