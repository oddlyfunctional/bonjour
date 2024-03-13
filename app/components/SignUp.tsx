"use client";

import { signUp } from "@/app/actions/auth";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";

const initialState: Awaited<ReturnType<typeof signUp>> = {
  ok: false,
};

export const SignUp = () => {
  const [state, action] = useFormState(signUp, initialState);
  const status = useFormStatus();

  if (state.ok) {
    return (
      <div className="text-center">
        <h1>Please check your email to verify your account.</h1>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col">
      <input
        name="email"
        type="email"
        placeholder="Email"
        className="mb-4 rounded p-2 outline"
      />
      <input
        name="password"
        type="password"
        placeholder="********"
        className="mb-4 rounded p-2 outline"
      />
      <button
        disabled={status.pending}
        type="submit"
        className="mb-2 w-full rounded bg-black p-2 text-white hover:bg-gray-500"
      >
        Sign up
      </button>
      <Link href="/">Already have an account?</Link>

      {state.error && (
        <div className="bg-red-500 text-white">{state.error}</div>
      )}
    </form>
  );
};
