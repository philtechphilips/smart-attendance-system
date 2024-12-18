import { ChangeEvent, useEffect, useState } from "react";
import { TextInputProps } from "./TextInput.types";

export default function useTextInput(props: TextInputProps) {
  const [validationError, setValidationError] = useState<string | null>(null);

  function handleInputChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    if (!props.onChange || !props.name) {
      console.error(
        "Expected props onChange?: (payload: FormInputPayload) => void and name?: string",
      );
      return;
    }
    props.onChange({
      field: props.name,
      value: event.currentTarget.value,
    });
  }

  function validateTextField() {
    try {
      if (props.validation) {
        setValidationError(null);
        props.validation.validateSync(props.value);
      }
    } catch (error: any) {
      setValidationError((error as Error).message);
    }
  }

  useEffect(() => {
    if (validationError) {
      validateTextField();
    }
  }, [props.value, validateTextField, validationError]);

  useEffect(() => {
    if (!props.validationTrigger) {
      setValidationError(null);
      return;
    }
    validateTextField();
  }, [props.validationTrigger]);

  return {
    validationError,
    handleInputChange,
  };
}
