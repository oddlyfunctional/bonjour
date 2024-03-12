"use client";

import { useFormState, useFormStatus } from "react-dom";
import { signIn } from "@/app/actions/auth";

const initialState: { error: string | null } = {
  error: null,
};

export const SignIn = () => {
  const [state, action] = useFormState(signIn, initialState);
  const status = useFormStatus();

  return (
    <form action={action} className="text-black">
      <input name="email" type="email" placeholder="Email" />
      <input name="password" type="password" placeholder="********" />
      <button disabled={status.pending} type="submit" className="text-white">
        Sign in
      </button>

      {state.error && (
        <div className="bg-red-500 text-white">{state.error}</div>
      )}
    </form>
  );
};
