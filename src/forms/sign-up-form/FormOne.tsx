import TextInput from '@/components/inputs/text-input/TextInput'
import React from 'react'
interface FormOneProps {
    user: any;
    handleChange: (event: any) => void;
    onNextStep: () => void;
  }
  const FormOne: React.FC<FormOneProps> = ({ user, handleChange, onNextStep }) => {
   
  return (
    <>
    <TextInput
          label="First Name"
          name="email"
          type="text"
          value={user.email}
          showCancelIcon={Boolean(user.email)}
          handleChange={handleChange}
        />

<TextInput
          label="Last Name"
          name="email"
          type="text"
          value={user.email}
          showCancelIcon={Boolean(user.email)}
          handleChange={handleChange}
        />

           <TextInput
          label="Middle Name"
          name="email"
          type="text"
          value={user.email}
          showCancelIcon={Boolean(user.email)}
          handleChange={handleChange}
        />
    </>
  )
}

export default FormOne