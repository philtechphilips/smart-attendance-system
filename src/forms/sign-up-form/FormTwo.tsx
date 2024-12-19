import TextInput from "@/components/inputs/text-input/TextInput";
import React from "react";
interface FormOneProps {
  user: any;
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
        value={user.email}
        showCancelIcon={Boolean(user.email)}
        handleChange={handleChange}
      />

      <TextInput
        label="Country"
        name="email"
        type="text"
        value={user.email}
        showCancelIcon={Boolean(user.email)}
        handleChange={handleChange}
      />

      <TextInput
        label="State"
        name="email"
        type="text"
        value={user.email}
        showCancelIcon={Boolean(user.email)}
        handleChange={handleChange}
      />
    </>
  );
};

export default FormTwo;
