"use client";
import ResetPasswordForm from "@/forms/reset/ResetPassword";
import AuthLayout from "@/layouts/layout";

export default function ResetToken() {
  return (
    <AuthLayout pageTitle={"Log in to continue"}>
      <ResetPasswordForm />
    </AuthLayout>
  );
}
