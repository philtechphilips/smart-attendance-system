import SignUpForm from "@/forms/sign-up-form/SignUpForm";
import AuthLayout from "@/layouts/layout";

export default function SignUpPage() {
  return (
    <AuthLayout pageTitle={"Start your journey"}>
      <SignUpForm />
    </AuthLayout>
  );
}
