import SelectInput from "@/components/inputs/select-input/SelectInput";
import TextInput from "@/components/inputs/text-input/TextInput";
import React from "react";
interface FormOneProps {
  user: any;
  handleChange: (event: any) => void;
}
const FormFour: React.FC<FormOneProps> = ({ user, handleChange }) => {
  return (
    <>
      <SelectInput
        label="Level"
        name="lga"
        value={user.email}
        options={[]}
        handleChange={handleChange}
      />

      <SelectInput
        label="School"
        name="phone"
        value={user.email}
        options={[]}
        handleChange={handleChange}
      />

      <SelectInput
        label="Department"
        name="email"
        value={user.email}
        options={[]}
        showCancelIcon={Boolean(user.email)}
        handleChange={handleChange}
      />

      <SelectInput
        label="Program"
        name="email"
        value={user.email}
        options={[]}
        showCancelIcon={Boolean(user.email)}
        handleChange={handleChange}
      />
    </>
  );
};

export default FormFour;
