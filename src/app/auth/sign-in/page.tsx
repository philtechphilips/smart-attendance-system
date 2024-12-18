import SignInForm from "@/forms/sign-in-form/SignInForm";
import AuthLayout from "@/layouts/layout";
import styles from "../../../app/styles/auth.module.scss";

export default function SignInPage() {
  return (
    <AuthLayout pageTitle={"Log in to continue"}>
      <SignInForm />
    </AuthLayout>
  );
}
