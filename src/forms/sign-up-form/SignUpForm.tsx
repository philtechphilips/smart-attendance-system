"use client";

import styles from "../../app/styles/auth.module.scss";
import { IMG_GoogleSvg } from "@/assets/images/index";
import TextInput from "@/components/inputs/text-input/TextInput";
import LinkButton from "@/components/buttons/link-button/LinkButton";
import BaseButton from "@/components/buttons/base-button/BaseButton";
import Image from "@/node_modules/next/image";
import useSignUpForm from "./useSignUpForm";
import { useRouter } from "@/node_modules/next/navigation";

export default function SignUpForm() {
  const windowRef = typeof window !== "undefined" ? window : null;
  const router = useRouter();
  const {
    formData,
    handleChange,
    handleSubmit,
    validationError,
    validationSchema,
    isLoading,
  } = useSignUpForm();

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className={styles.signin_container}>
      <section>
        <h2 className="text-[28px] font-bold text-[#1D1D1D]">
          Get started now
        </h2>
        <p className="text-base font-normal text-[#ACACAC] mt-2">
          Enjoy your credentials to create an account.
        </p>

        <div className={styles.google}>
          <Image
            src={IMG_GoogleSvg}
            alt="Next.js Logo"
            width={28}
            height={28}
            priority
          />
          <p className="text-sm font-normal text-[#334155]  py-2">
            Login with Google
          </p>
        </div>
      </section>

      <div className={styles.divider}>
        <p>OR</p>
      </div>

      <form onSubmit={handleSubmit}>
        <TextInput
          id="fullName"
          label="Full Name"
          name="fullName"
          labelColor
          value={formData.fullName}
          onChange={handleChange}
          validationTrigger={validationError}
          validation={validationSchema?.fields.fullName}
        />

        <TextInput
          id="company"
          label="Company"
          name="company"
          labelColor
          value={formData.company}
          onChange={handleChange}
          validationTrigger={validationError}
          validation={validationSchema?.fields.company}
        />

        <TextInput
          id="email"
          label="Email Address"
          name="email"
          labelColor
          value={formData.email}
          onChange={handleChange}
          validationTrigger={validationError}
          validation={validationSchema?.fields.email}
        />

        <TextInput
          id="password"
          label="Password"
          name="password"
          type="password"
          labelColor
          value={formData.password}
          onChange={handleChange}
          validationTrigger={validationError}
          validation={validationSchema?.fields.password}
        />

        <BaseButton type="submit" fit disabled={isLoading}>
          {isLoading ? "Loading..." : "Create account"}
        </BaseButton>

        <LinkButton href={"/auth/sign-in"}>
          <p className={styles.new_user}>
            Already have an account?{" "}
            <span style={{ color: "#4253f0" }}>Sign In</span>
          </p>
        </LinkButton>
      </form>
    </div>
  );
}
