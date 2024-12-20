import TextInput from "@/components/inputs/text-input/TextInput";
import { CreateStudent } from "@/types/User";
import React from "react";
interface FormOneProps {
  user: CreateStudent;
  handleChange: (event: any) => void;
  errors: any;
  touched: any;
}
const FormTwo: React.FC<FormOneProps> = ({
  user,
  handleChange,
  errors,
  touched,
}) => {
  return (
    <>
      <TextInput
        label="DOB"
        name="dob"
        type="date"
        value={user.dob}
        errorMessage={touched.dob && errors.dob}
        handleChange={handleChange}
      />

      <TextInput
        label="Country"
        name="country"
        type="text"
        value={user.country}
        handleChange={handleChange}
        errorMessage={touched.country && errors.country}
      />

      <TextInput
        label="State"
        name="state"
        type="text"
        value={user.state}
        errorMessage={touched.state && errors.state}
        handleChange={handleChange}
      />
    </>
  );
};

export default FormTwo;
