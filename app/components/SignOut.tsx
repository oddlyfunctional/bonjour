"use client";
import { signOut } from "@/app/actions/auth";
import { useState } from "react";

export const SignOut = () => {
  const [clicked, setClicked] = useState(false);
  return (
    <button
      disabled={clicked}
      onClick={() => {
        setClicked(true);
        signOut();
      }}
    >
      Sign out
    </button>
  );
};
