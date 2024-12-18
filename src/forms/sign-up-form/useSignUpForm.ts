import { useForm } from "../../utils/hooks/useForm";
import { object, string } from "yup";
import { toast } from "react-hot-toast";
import { UserAPI } from "@/http/api/auth/auth.types";
import { SignUpUser } from "@/http/api/auth/auth.index";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useUserStore from "@/store/userStore";

export default function useSignUpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useUserStore();
  const form = useForm<UserAPI.SignUpUserDTO>({
    initialFormData: {
      fullName: "",
      email: "",
      company: "",
      password: "",
    },

    validationSchema: object().shape({
      fullName: string().required("name is required"),
      email: string()
        .email("Provide a valid email address")
        .required("Email is required"),
      company: string().optional(),
      password: string().required("Password is required"),
    }),

    async onSubmit(formData) {
      try {
        setIsLoading(true);
        const data = await SignUpUser(formData);
        if (data) {
          setUser(data);
          router.push("/dashboard/home");
          toast.success("Signup Successful!");
        }
      } catch (error) {
        toast.error((error as Error).message || "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return {
    ...form,
    isLoading,
  };
}
