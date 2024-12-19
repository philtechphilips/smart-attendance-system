import SelectInput from "@/components/inputs/select-input/SelectInput";
import TextInput from "@/components/inputs/text-input/TextInput";
import React from "react";
interface FormOneProps {
  user: any;
  handleChange: (event: any) => void;
  errors: any;
  touched: any;
}
const FormFour: React.FC<FormOneProps> = ({
  user,
  handleChange,
  errors,
  touched,
}) => {
  return (
    <>
      <SelectInput
        label="Level"
        name="levelId"
        value={user.levelId}
        options={[]}
        errorMessage={touched.levelId && errors.levelId}
        handleChange={handleChange}
      />

      <SelectInput
        label="School"
        name="schoolId"
        value={user.schoolId}
        options={[]}
        errorMessage={touched.schoolId && errors.schoolId}
        handleChange={handleChange}
      />

      <SelectInput
        label="Department"
        name="departmentId"
        value={user.departmentId}
        options={[]}
        errorMessage={touched.departmentId && errors.departmentId}
        handleChange={handleChange}
      />

      <SelectInput
        label="Program"
        name="programId"
        value={user.programId}
        options={[]}
        errorMessage={touched.programId && errors.programId}
        handleChange={handleChange}
      />
    </>
  );
};

export default FormFour;
