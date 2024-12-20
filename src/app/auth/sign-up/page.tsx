import AuthLayout from "@/layouts/layout";
import SignUpForm from "@/forms/sign-up-form/SignUpForm";

export default function SignInPage() {
  return (
    <AuthLayout pageTitle={"Log in to continue"}>
      <SignUpForm />
    </AuthLayout>
  );
}
