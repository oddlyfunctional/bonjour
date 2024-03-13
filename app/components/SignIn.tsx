"use client";

import { signIn } from "@/app/actions/auth";
import { useFormState, useFormStatus } from "react-dom";

const initialState: { error: string | null } = {
  error: null,
};

export const SignIn = () => {
  const [state, action] = useFormState(signIn, initialState);
  const status = useFormStatus();

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
        Sign in
      </button>

      {state.error && <div className="text-red-600">{state.error}</div>}
    </form>
  );
};
