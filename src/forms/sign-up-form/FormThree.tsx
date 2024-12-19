import TextInput from "@/components/inputs/text-input/TextInput";
import React from "react";
interface FormOneProps {
  user: any;
  handleChange: (event: any) => void;
  errors: any;
  touched: any;
}
const FormThree: React.FC<FormOneProps> = ({
  user,
  handleChange,
  errors,
  touched,
}) => {
  return (
    <>
      <TextInput
        label="L.G.A"
        name="lga"
        type="text"
        value={user.email}
        showCancelIcon={Boolean(user.email)}
        handleChange={handleChange}
      />

      <TextInput
        label="Phone"
        name="phone"
        type="tel"
        value={user.email}
        showCancelIcon={Boolean(user.email)}
        handleChange={handleChange}
      />

      <TextInput
        label="Email"
        name="email"
        type="text"
        value={user.email}
        showCancelIcon={Boolean(user.email)}
        handleChange={handleChange}
      />

      <TextInput
        label="Address"
        name="address"
        type="text"
        value={user.email}
        showCancelIcon={Boolean(user.email)}
        handleChange={handleChange}
      />
    </>
  );
};

export default FormThree;
