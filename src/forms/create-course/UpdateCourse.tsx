"use client";
import { useRouter } from "next/navigation";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextInput from "@/components/inputs/text-input/TextInput";
import styles from "../../app/styles/auth.module.scss";
import BaseButton from "@/components/buttons/base-button/BaseButton";
import { RootState, useAppDispatch, useAppSelector } from "@/reducer/store";
import { login } from "@/reducer/actions/auth.dispatcher";
import LoaderIcon from "@/components/icons/LoaderIcon";
import SelectInput from "@/components/inputs/select-input/SelectInput";
import { useEffect, useState } from "react";
import { getAllLevels } from "@/reducer/actions/level.dispatcher";
import { getAllPrograms } from "@/reducer/actions/program.dispatcher";
import { getAllDepartments } from "@/reducer/actions/department.dispatcher";
import { getDepartmentStaff } from "@/services/Staffs.service";
import classNames from "classnames";
import { createCourses } from "@/services/courses.service";
import { toast } from "react-toastify";

export default function CreateCourseForm({ closeForm }: any) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user: userData, isLoggedIn } = useAppSelector(
    (state: RootState) => state.auth,
  );

  const { allLevels } = useAppSelector((state: RootState) => state.levels);
  const { allPrograms } = useAppSelector((state: RootState) => state.programs);
  const { allDepartments } = useAppSelector(
    (state: RootState) => state.departments,
  );
  const [staffs, setStaffs] = useState<any>([]);
  console.log(staffs);
  const allStaffs = async () => {
    try {
      const response = await getDepartmentStaff();

      if (!response?.items || !Array.isArray(response.items)) {
        console.warn("Unexpected response format:", response);
        return;
      }

      const staffList = response.items.map(
        ({ firstname, lastname, middlename, id }: any) => ({
          name: [firstname, lastname, middlename].filter(Boolean).join(" "),
          id,
        }),
      );

      setStaffs(staffList);
    } catch (error) {
      console.error("Failed to fetch department staff:", error);
    }
  };

  useEffect(() => {
    allStaffs();
    dispatch(getAllLevels());
    dispatch(getAllPrograms());
    dispatch(getAllDepartments());
  }, [dispatch]);

  const initialValues = {
    name: "",
    code: "",
    lecturerId: "",
    classId: "",
    programId: "",
    departmentId: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Course name is required"),
    code: Yup.string().required("Code is required"),
    lecturerId: Yup.string().required("Select a lecturer"),
    classId: Yup.string().required("Select a class"),
    programId: Yup.string().required("Select a program"),
    departmentId: Yup.string().required("Select a department"),
  });

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting, resetForm }: any,
  ) => {
    const res = await createCourses(values);
    if (res) {
      toast.success("Courses created sucessfully!");
      resetForm();
    }
    setSubmitting(false);
  };

  return (
    <div className={`${styles.signin_container} h-fit rounded-lg bg-white`}>
      <div className="flex justify-between items-center">
        <h1 className="font-semibold">Reassign Course</h1>

        <div
          onClick={closeForm}
          className="w-10 cursor-pointer h-10 flex items-center justify-center bg-gray-400 "
        >
          <i className="ri-close-fill text-lg font-bold"></i>
        </div>
      </div>
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
            <SelectInput
              label="Lecturer"
              name="lecturerId"
              value={values.lecturerId}
              options={staffs ? staffs : []}
              errorMessage={touched.lecturerId && errors.lecturerId}
              handleChange={handleChange}
            />
            <div className="py-4"></div>
            <BaseButton type="submit" fit disabled={isSubmitting}>
              {isSubmitting ? <LoaderIcon /> : "Reassign Course"}
            </BaseButton>
          </Form>
        )}
      </Formik>
    </div>
  );
}
