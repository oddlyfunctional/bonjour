"use client";

import { useFormState, useFormStatus } from "react-dom";
import { signUp } from "@/app/actions/auth";

const initialState: Awaited<ReturnType<typeof signUp>> = {
  ok: false,
};

export const SignUp = () => {
  const [state, action] = useFormState(signUp, initialState);
  const status = useFormStatus();

  if (state.ok) {
    return (
      <div>
        <h1>Please check your email to verify your account.</h1>
      </div>
    );
  }

  return (
    <form action={action} className="text-black">
      <input name="email" type="email" placeholder="Email" />
      <input name="password" type="password" placeholder="********" />
      <button disabled={status.pending} type="submit" className="text-white">
        Sign up
      </button>

      {state.error && (
        <div className="bg-red-500 text-white">{state.error}</div>
      )}
    </form>
  );
};
