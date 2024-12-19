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
import FormTwo from "./FormTwo";
import FormFour from "./FormFour";
import FormFive from "./FormFive";
import FormThree from "./FormThree";
import { COLOURS } from "@/constants/colors";

export default function SignUpForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user: userData, isLoggedIn } = useAppSelector(
    (state: RootState) => state.auth,
  );
  const [formStep, setFormStep] = useState(1);
  const [formProgress, setFormProgress] = useState(20);
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

  const onNext = () => {
    setFormStep(formStep + 1);
    setFormProgress(formProgress + 20);
  };

  const onPrev = () => {
    setFormStep(formStep - 1);
    setFormProgress(formProgress + 20);
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
      {formStep != 1 && (
        <div
          onClick={onPrev}
          className="w-8 h-8 rounded cursor-pointer mb-4 overflow-hidden"
        >
          <div className="w-8 h-8 flex bg-[#4253F0] rounded-4xl items-center justify-center p-2">
            <i className="ri-arrow-left-s-line text-lg text-white"></i>
          </div>
        </div>
      )}

      <progress
        className={`h-2 w-full mb-8 rounded-full custom-progress`}
        max="100"
        style={{ color: COLOURS.primary }}
        value={formProgress}
      />
      <section>
        <h2 className="text-[28px] font-bold text-[#1D1D1D]">
          Getting Started
        </h2>
        <p className="text-base font-normal text-[#ACACAC] mt-2">
          Create an account to continue
        </p>
      </section>

      <form onSubmit={handleSubmit}>
        {formStep === 1 && <FormOne user={user} handleChange={handleChange} />}
        {formStep === 2 && <FormTwo user={user} handleChange={handleChange} />}
        {formStep === 3 && (
          <FormThree user={user} handleChange={handleChange} />
        )}
        {formStep === 4 && <FormFour user={user} handleChange={handleChange} />}
        {formStep === 5 && <FormFive user={user} handleChange={handleChange} />}

        {formStep === 5 ? (
          <BaseButton className="mt-5" type="submit" fit disabled={loading}>
            Create Account
          </BaseButton>
        ) : (
          <BaseButton
            onClick={onNext}
            className="mt-5"
            type="button"
            fit
            disabled={loading}
          >
            Next
          </BaseButton>
        )}
      </form>
    </div>
  );
}
