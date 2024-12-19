"use client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import TextInput from "@/components/inputs/text-input/TextInput";
import styles from "../../app/styles/auth.module.scss";
import LinkButton from "@/components/buttons/link-button/LinkButton";
import BaseButton from "@/components/buttons/base-button/BaseButton";
import { RootState, useAppDispatch, useAppSelector } from "@/reducer/store";
import { login } from "@/reducer/actions/auth.dispatcher";
import toast from "react-toastify";
import FormOne from "./FormOne";

export default function SignUpForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user: userData, isLoggedIn } = useAppSelector(
    (state: RootState) => state.auth,
  );
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    middlename: "",
    dob: "",
    country: "",
    lga: "",
    state: "",
    phone: "",
    email: "",
    address: "",
    guardian: "",
    guardianAddress: "",
    guardianPhone: "",
    levelId: "",
    schoolId: "",
    departmentId: "",
    programId: "",
  });

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    event.preventDefault();
    if (user.email) {
      // const result = await dispatch(
      //   login({ email: user.email, password: user.password }),
      // );
     
    }
  };
  return (
    <div className={styles.signin_container}>
      <section>
        <h2 className="text-[28px] font-bold text-[#1D1D1D]">
        Getting Started
        </h2>
        <p className="text-base font-normal text-[#ACACAC] mt-2">
        Create an account to continue
        </p>
      </section>

      <form onSubmit={handleSubmit}>
        
        <FormOne user={user} onNextStep={() => {}} handleChange={handleChange}></FormOne>

        <BaseButton className="mt-5" type="submit" fit disabled={loading}>
          Create Account
        </BaseButton>
      </form>
    </div>
  );
}
