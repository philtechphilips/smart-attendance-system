"use client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import TextInput from "@/components/inputs/text-input/TextInput";
import styles from "../../app/styles/auth.module.scss";
import LinkButton from "@/components/buttons/link-button/LinkButton";
import BaseButton from "@/components/buttons/base-button/BaseButton";
import { RootState, useAppDispatch, useAppSelector } from "@/reducer/store";
import { login } from "@/reducer/actions/auth.dispatcher";
import toast from "react-toastify";



export default function SignInForm() {
  const router = useRouter();
  const dispatch = useAppDispatch()
  const {user: userData, isLoggedIn } = useAppSelector((state:RootState)=> state.auth)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    setLoading(true)
    event.preventDefault();
    if (user.email && user.password) {
      const result = await dispatch(login({ email: user.email, password: user.password }))
      if(result){
        const parseResult = JSON.parse(JSON.stringify(result?.payload))
      const token = parseResult?.token
      localStorage.setItem('token', token);
      }
      setLoading(false)
     if(result?.type?.includes('rejected')){
        setLoading(false)
     }
      
    }
  };
  return (
    <div className={styles.signin_container}>
      <section>
        <h2 className="text-[28px] font-bold text-[#1D1D1D]">
          Log in to continue
        </h2>
        <p className="text-base font-normal text-[#ACACAC] mt-2">
          Enjoy your credentials to access your account.
        </p>
      </section>

      <form onSubmit={handleSubmit}>
        <TextInput
          label="Email Address"
          name="email"
          type="text"
          value={user.email}
          showCancelIcon={Boolean(user.email)}
              handleChange={handleChange}
              handleCancelClick={() => setUser({ ...user, email: "" })}
        />

        <TextInput
          label="Password"
          name="password"
          type="password"
          value={user.password}
          handleChange={handleChange}
        />

        <LinkButton href={"/auth/forgot-password"}>
          <p className={styles.forgot_password}>Forgot password?</p>
        </LinkButton>

        <BaseButton type="submit"  fit disabled={loading}>
          Login
        </BaseButton>

        <LinkButton href={"/auth/sign-up"}>
          <p className={styles.new_user}>
            Don’t have an account?{" "}
            <span style={{ color: "#4253f0" }}>Sign Up</span>
          </p>
        </LinkButton>
      </form>
    </div>
  );
}
