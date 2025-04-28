import { object, string } from "yup";
// import { useForm } from "../../utils/hooks/useForm";
// import { toast } from "react-toastify";
// import { UserAPI } from "@/http/api/auth/auth.types";
// import { ForgotPassword } from "@/http/api/auth/auth.index";
import { useState } from "react";

export default function useForgotPasswordForm() {
  // const [isLoading, setIsLoading] = useState(false);
  // const form = useForm<UserAPI.ForgotPasswordDTO>({
  //   initialFormData: {
  //     email: "",
  //   },

  //   validationSchema: object({
  //     email: string()
  //       .required("This field is required")
  //       .email("Please provide a valid email"),
  //   }),

  //   async onSubmit(formData) {
  //     setIsLoading(true);
  //     const { data, error } = await ForgotPassword(formData);
  //     if (data) {
  //       toast.success(
  //         data.message ||
  //           "A reset email has been sent. Please check your inbox.",
  //       );
  //       setIsLoading(false);
  //     }
  //     if (error) {
  //       toast.error(
  //         error.message ||
  //           "This email does not exist in our database. Please sign up.",
  //       );
  //       setIsLoading(false);
  //     }
  //   },
  // });

  // return { ...form, isLoading };
}
