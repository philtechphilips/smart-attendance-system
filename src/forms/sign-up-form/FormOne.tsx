import TextInput from "@/components/inputs/text-input/TextInput";
import { CreateStudent } from "@/types/User";
import React from "react";
interface FormOneProps {
  user: CreateStudent;
  handleChange: (event: any) => void;
  errors: any;
  touched: any;
}
const FormOne: React.FC<FormOneProps> = ({
  user,
  handleChange,
  errors,
  touched,
}) => {
  return (
    <>
      <TextInput
        label="First Name"
        name="firstname"
        type="text"
        value={user.firstname}
        handleChange={handleChange}
        errorMessage={touched.firstname && errors.firstname}
      />

      <TextInput
        label="Last Name"
        name="lastname"
        type="text"
        value={user.lastname}
        errorMessage={touched.lastname && errors.lastname}
        handleChange={handleChange}
      />

      <TextInput
        label="Middle Name"
        name="middlename"
        type="text"
        value={user.middlename}
        errorMessage={touched.middlename && errors.middlename}
        handleChange={handleChange}
      />
    </>
  );
};

export default FormOne;
