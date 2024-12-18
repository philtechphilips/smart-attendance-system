"use client";

import { IMG_GoogleSvg } from "@/assets/images/index";
import TextInput from "@/components/inputs/text-input/TextInput";
import styles from "../../app/styles/auth.module.scss";
import LinkButton from "@/components/buttons/link-button/LinkButton";
import BaseButton from "@/components/buttons/base-button/BaseButton";
import Image from "../../../node_modules/next/image";

export default function SignInForm() {
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

      <form onSubmit={() => {}}>
        <TextInput
          id="email"
          label="Email Address"
          name="email"
          labelColor
          value=""
          onChange={() => {}}
          validationTrigger={""}
          validation={""}
        />

        <TextInput
          id="password"
          label="Password"
          name="password"
          type="password"
          labelColor
          value={""}
          onChange={() => {}}
          validationTrigger={""}
          validation={""}
        />

        <LinkButton href={"/auth/forgot-password"}>
          <p className={styles.forgot_password}>Forgot password?</p>
        </LinkButton>

        <BaseButton type="submit" fit disabled={true}>
          Login
        </BaseButton>

        <LinkButton href={"/auth/sign-up"}>
          <p className={styles.new_user}>
            Don’t have an account?{" "}
            <span style={{ color: "#4253f0" }}>Sign Up</span>
          </p>
        </LinkButton>
      </form>
    </div>
  );
}
