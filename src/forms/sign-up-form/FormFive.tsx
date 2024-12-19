import TextInput from "@/components/inputs/text-input/TextInput";
import React from "react";
interface FormOneProps {
  user: any;
  handleChange: (event: any) => void;
  errors: any;
  touched: any;
}
const FormFive: React.FC<FormOneProps> = ({
  user,
  handleChange,
  errors,
  touched,
}) => {
  return (
    <>
      <TextInput
        label="Guardian Name"
        name="guardian"
        type="text"
        value={user.guardian}
        errorMessage={touched.guardian && errors.guardian}
        handleChange={handleChange}
      />

      <TextInput
        label="Guardian Phone"
        name="guardianPhone"
        type="tel"
        value={user.guardianPhone}
        errorMessage={touched.guardianPhone && errors.guardianPhone}
        handleChange={handleChange}
      />

      <TextInput
        label="Guardian Address"
        name="guardianAddress"
        type="text"
        value={user.guardianAddress}
        errorMessage={touched.guardianAddress && errors.guardianAddress}
        handleChange={handleChange}
      />

      <TextInput
        label="Guardian Email Address"
        name="guardianEmail"
        type="text"
        value={user.guardianEmail}
        errorMessage={touched.guardianEmail && errors.guardianEmail}
        handleChange={handleChange}
      />
    </>
  );
};

export default FormFive;
