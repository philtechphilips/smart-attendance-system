"use client";
import { useRouter } from "next/navigation";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import TextInput from "@/components/inputs/text-input/TextInput";
import styles from "../../app/styles/auth.module.scss";
import LinkButton from "@/components/buttons/link-button/LinkButton";
import BaseButton from "@/components/buttons/base-button/BaseButton";
import { RootState, useAppDispatch, useAppSelector } from "@/reducer/store";
import { login } from "@/reducer/actions/auth.dispatcher";
import toast from "react-toastify";
import LoaderIcon from "@/components/icons/LoaderIcon";

export default function SignInForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user: userData, isLoggedIn } = useAppSelector(
    (state: RootState) => state.auth,
  );

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: any,
  ) => {
    setSubmitting(true);
    const result = await dispatch(login(values));
    setSubmitting(false);

    if (result) {
      const parseResult = JSON.parse(JSON.stringify(result?.payload));
      const token = parseResult?.token;
      localStorage.setItem("token", token);
    }
    if (result?.type?.includes("rejected")) {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.signin_container}>
      <section>
        <h2 className="text-[28px] font-bold text-[#1D1D1D]">
          Log in to continue
        </h2>
        <p className="text-base font-normal text-[#ACACAC] mt-2">
          Enjoy your credentials to access your account.
        </p>
      </section>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          isSubmitting,
          errors,
          touched,
          values,
          handleChange,
          handleBlur,
        }) => (
          <Form>
            {/* Email Input */}
            <TextInput
              label="Email Address"
              name="email"
              type="text"
              value={values.email}
              showCancelIcon={Boolean(values.email)}
              handleChange={handleChange}
              handleCancelClick={() =>
                handleChange({ target: { name: "email", value: "" } })
              }
              errorMessage={touched.email && errors.email}
            />

            {/* Password Input */}
            <TextInput
              label="Password"
              name="password"
              type="password"
              value={values.password}
              handleChange={handleChange}
              // handleBlur={handleBlur}
              errorMessage={touched.password && errors.password}
            />

            {/* Forgot Password Link */}
            <LinkButton href={"/auth/forgot-password"}>
              <p className={styles.forgot_password}>Forgot password?</p>
            </LinkButton>

            {/* Submit Button */}
            <BaseButton type="submit" fit disabled={isSubmitting}>
              {isSubmitting ? <LoaderIcon /> : "Login"}
            </BaseButton>

            {/* Sign Up Link */}
            <LinkButton href={"/auth/sign-up"}>
              <p className={styles.new_user}>
                Don’t have an account?{" "}
                <span style={{ color: "#4253f0" }}>Sign Up</span>
              </p>
            </LinkButton>
          </Form>
        )}
      </Formik>
    </div>
  );
}
