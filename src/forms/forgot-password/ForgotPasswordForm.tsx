"use client";

import { useState, ChangeEvent } from "react";
import TextInput from "@/components/inputs/text-input/TextInput";
import styles from "../../app/styles/auth.module.scss";
import BaseButton from "@/components/buttons/base-button/BaseButton";
import useForgotPasswordForm from "./useForgotPasswordForm";

export default function ForgotPasswordForm() {
  const {
    formData,
    handleChange,
    handleSubmit,
    validationError,
    validationSchema,
    isLoading,
  } = useForgotPasswordForm();
  return (
    <div className={styles.signin_container}>
      <section>
        <h2 className="text-[28px] font-bold text-[#1D1D1D]">
          Forgot your password{" "}
        </h2>
        <p className="text-base font-normal text-[#ACACAC] mt-2">
          Please enter your email for instructions on how to reset your
          password.{" "}
        </p>
      </section>

      <form onSubmit={handleSubmit}>
        <TextInput
          id="email"
          name="email"
          value={formData.email}
          label="Email Address"
          labelColor
          onChange={handleChange}
          validation={validationSchema?.fields.email}
          validationTrigger={validationError}
          placeholder="xyz@gmail.com"
        />

        <BaseButton type="submit" fit disabled={isLoading}>
          {isLoading ? "Loading..." : "Send"}
        </BaseButton>
      </form>
    </div>
  );
}
