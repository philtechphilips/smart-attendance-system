"use client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import toast from "react-toastify";
import TextInput from "@/components/inputs/text-input/TextInput";
import styles from "../../app/styles/auth.module.scss";
import LinkButton from "@/components/buttons/link-button/LinkButton";
import BaseButton from "@/components/buttons/base-button/BaseButton";
import { RootState, useAppDispatch, useAppSelector } from "@/reducer/store";
import { login } from "@/reducer/actions/auth.dispatcher";
import FormOne from "./FormOne";
import FormTwo from "./FormTwo";
import FormFour from "./FormFour";
import FormFive from "./FormFive";
import FormThree from "./FormThree";
import { COLOURS } from "@/constants/colors";
import { register } from "@/reducer/actions/register.dispatcher";

export default function SignUpForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [formStep, setFormStep] = useState(1);
  const [formProgress, setFormProgress] = useState(20);
  const [loading, setLoading] = useState(false);

  const initialValues = {
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
    guardianEmail: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    firstname: Yup.string().required("Firstname is required"),
    lastname: Yup.string().required("Lastname is required"),
    middlename: Yup.string().required("Middlename is required"),
    dob: Yup.string().required("Date of birth is required"),
    country: Yup.string().required("Country is required"),
    lga: Yup.string().required("Local government area is required"),
    state: Yup.string().required("State is required"),
    phone: Yup.string().required("Phone is required"),
    address: Yup.string().required("Address is required"),
    guardian: Yup.string().required("Guardian is required"),
    guardianAddress: Yup.string().required("Guardian Address is required"),
    guardianPhone: Yup.string().required("Guardian Phone is required"),
    guardianEmail: Yup.string().required("Guardian Phone is required"),
    levelId: Yup.string().required("Level is required"),
    schoolId: Yup.string().required("School is required"),
    departmentId: Yup.string().required("Department is required"),
    programId: Yup.string().required("Program is required"),
  });

  const onNext = () => {
    setFormStep(formStep + 1);
    setFormProgress(formProgress + 20);
  };

  const onPrev = () => {
    setFormStep(formStep - 1);
    setFormProgress(formProgress - 20);
  };

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: any,
  ) => {
    setSubmitting(true);
    const result = await dispatch(register(values));
    setSubmitting(false);
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
            {formStep === 1 && (
              <FormOne
                user={values}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
              />
            )}
            {formStep === 2 && (
              <FormTwo
                user={values}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
              />
            )}
            {formStep === 3 && (
              <FormThree
                user={values}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
              />
            )}
            {formStep === 4 && (
              <FormFour
                user={values}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
              />
            )}
            {formStep === 5 && (
              <FormFive
                user={values}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
              />
            )}

            {formStep === 5 ? (
              <BaseButton
                className="mt-5"
                type="submit"
                fit
                // disabled={isSubmitting}
              >
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
          </Form>
        )}
      </Formik>
    </div>
  );
}
