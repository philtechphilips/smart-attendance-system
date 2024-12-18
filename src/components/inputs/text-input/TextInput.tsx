import React, { useState } from "react";
import { TextInputProps } from "./TextInput.types";
import styles from "./style.module.scss";
import { FontAwesomeIcon } from "../../../../node_modules/@fortawesome/react-fontawesome/index";
import {
  faEye,
  faEyeSlash,
} from "../../../../node_modules/@fortawesome/free-solid-svg-icons/index";
import useTextInput from "./useTextInput";

export default function TextInput(props: TextInputProps) {
  const {
    label,
    labelColor,
    onChange,
    validation,
    validationTrigger,
    type,
    ...inputProps
  } = props;

  const { validationError, handleInputChange } = useTextInput(props);

  const [focused, setFocused] = useState(false);
  const [hasContent, setHasContent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
    if (props.value?.toString().trim() !== "") {
      setHasContent(true);
    }
  };

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setValue(e.target.value);
  //   onChange(e.target.value);
  //   if (e.target.value.trim() === "") {
  //     setHasContent(false);
  //   } else {
  //     setHasContent(true);
  //   }
  // };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className={styles.text_input_container}>
      <label
        className={styles.text_input_container_label}
        style={{ color: labelColor ? "#4253F0" : "000" }}
      >
        {label}
      </label>

      <input
        {...inputProps}
        type={showPassword ? "text" : type}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={{
          backgroundColor: hasContent ? "#eef9fa" : "",
          border: hasContent ? "2px solid #dde7f8" : "",
        }}
        className={styles.text_input_container_input}
      />
      {validationError && (
        <p className="text-red-500 font-bold text-xs mt-1.5">
          {validationError}
        </p>
      )}
      {type === "password" && (
        <p onClick={togglePasswordVisibility} className={styles.password_icon}>
          {showPassword ? (
            <FontAwesomeIcon icon={faEye} />
          ) : (
            <FontAwesomeIcon icon={faEyeSlash} />
          )}
        </p>
      )}
    </div>
  );
}
