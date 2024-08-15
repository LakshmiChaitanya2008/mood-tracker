import React from "react";
import { fugaz_One } from "@/app/layout";
import Link from "next/link";
import { signup } from "../actions";
export default function page() {
  return (
    <div className="flex flex-col flex-1 justify-center items-center gap-4 max-w-[400px] mx-auto h-screen">
      <h3 className={"text-4xl sm:text-5xl md:text-6xl " + fugaz_One.className}>
        Sign Up
      </h3>
      <form action={signup}>
        <input
          className="w-full max-w-[400px] mx-auto px-3 duration-200 hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py-3 border border-solid border-indigo-400 rounded-md outline-none"
          placeholder="Name"
          name="name"
        />
        <input
          className="w-full max-w-[400px] mx-auto px-3 duration-200 hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py-3 border border-solid border-indigo-400 rounded-md outline-none"
          placeholder="Email"
          name="email"
        />
        <input
          className="w-full max-w-[400px] mx-auto px-3 duration-200 hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py-3 border border-solid border-indigo-400 rounded-md outline-none"
          placeholder="Password"
          type="password"
          name="password"
        />
        <div className="w-full">
          <button className="bg-primary text-white py-3 px-8 rounded-2xl w-full">
            Submit
          </button>
        </div>
      </form>
      <p>
        Already have an account?{" "}
        <Link href="/auth/login" className="text-primary underline">
          Login
        </Link>
      </p>
    </div>
  );
}
