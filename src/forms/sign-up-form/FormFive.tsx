import TextInput from "@/components/inputs/text-input/TextInput";
import React from "react";
interface FormOneProps {
  user: any;
  handleChange: (event: any) => void;
}
const FormFive: React.FC<FormOneProps> = ({ user, handleChange }) => {
  return (
    <>
      <TextInput
        label="Guardian Name"
        name="lga"
        type="text"
        value={user.email}
        showCancelIcon={Boolean(user.email)}
        handleChange={handleChange}
      />

      <TextInput
        label="Guardian Phone"
        name="phone"
        type="tel"
        value={user.email}
        showCancelIcon={Boolean(user.email)}
        handleChange={handleChange}
      />

      <TextInput
        label="Guardian Address"
        name="email"
        type="text"
        value={user.email}
        showCancelIcon={Boolean(user.email)}
        handleChange={handleChange}
      />

      <TextInput
        label="Guardian Email Address"
        name="email"
        type="text"
        value={user.email}
        showCancelIcon={Boolean(user.email)}
        handleChange={handleChange}
      />
    </>
  );
};

export default FormFive;
