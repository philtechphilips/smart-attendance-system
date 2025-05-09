"use client";

// import BaseButton from "@/components/buttons/base-button/BaseButton";
// import TextInput from "@/components/inputs/text-input/TextInput";
// import styles from "../../app/styles/auth.module.scss";
// import useResetPasswordForm from "./useResetPasswordForm";
// import { useEffect, useState } from "react";

export default function ResetPasswordForm() {
  // const {
  //   formData,
  //   handleChange,
  //   handleSubmit,
  //   validationSchema,
  //   validationError,
  //   isLoading,
  // } = useResetPasswordForm();
  // const [passwordStrength, setPasswordStrength] = useState(0);
  // const getPasswordStrengthLevel = (password: any) => {
  //   let strengthLevel = 0;
  //   if (password) {
  //     strengthLevel = 1; // Starts with weak
  //     if (password.length > 2) strengthLevel = 2;
  //     if (password.length > 5 || /[^A-Za-z0-9]/.test(password))
  //       strengthLevel = 3;
  //     if (
  //       password.length > 9 ||
  //       /[A-Z]/.test(password) ||
  //       /[^A-Za-z0-9]/.test(password)
  //     )
  //       strengthLevel = 4;
  //   }
  //   return strengthLevel;
  // };
  // useEffect(() => {
  //   const level = getPasswordStrengthLevel(formData.new_password);
  //   setPasswordStrength(level);
  // }, [formData.new_password]);
  // // useEffect(() => {
  // //   if (formData.confirmPassword !== formData.new_password) {
  // //      console.log('Password mismatch')
  // //   }
  // // }, []);
  // const getStrengthBarColor = (index: number) => {
  //   const colors = ["#d3d3d3", "#EB5757", "#ff3e3e", "#ff8c00", "#74c947"]; // grey, red, orange, green, blue
  //   return index < passwordStrength ? colors[passwordStrength] : colors[0];
  // };
  // return (
  //   <div className={styles.signin_container}>
  //     <h2 className="text-[28px] font-bold text-[#1D1D1D]">Set New Password</h2>
  //     <p className="text-base font-normal text-[#ACACAC] mt-2">
  //       Enjoy the seamless payroll creation and much more with Oleefee!
  //     </p>
  //     <form onSubmit={handleSubmit}>
  //       <div>
  //         <TextInput
  //           id="new_password"
  //           label="Password"
  //           name="new_password"
  //           type="password"
  //           labelColor
  //           value={formData.new_password}
  //           onChange={handleChange}
  //           validationTrigger={validationError}
  //           validation={validationSchema?.fields.new_password}
  //         />
  //       </div>
  //       <div className={styles.passwordStrengthContainer}>
  //         <span className={styles.passwordStrengthLabel}>
  //           Password Strength:
  //         </span>
  //         <div className={styles.passwordStrengthMeter}>
  //           {[1, 2, 3].map((index) => (
  //             <div
  //               key={index}
  //               className={styles.passwordStrengthBar}
  //               style={{ backgroundColor: getStrengthBarColor(index) }}
  //             />
  //           ))}
  //         </div>
  //       </div>
  //       <div className={styles.bridge}>
  //         <TextInput
  //           id="confirm-password"
  //           name="confirmPassword"
  //           type="password"
  //           label="Confirm Password"
  //           labelColor
  //           value={formData.confirmPassword}
  //           onChange={handleChange}
  //           validation={validationSchema?.fields.confirmPassword}
  //           validationTrigger={validationError}
  //         />
  //       </div>
  //       <BaseButton type="submit" fit disabled={isLoading}>
  //         {isLoading ? "Loading..." : "Reset"}
  //       </BaseButton>
  //     </form>
  //   </div>
  // );
}
