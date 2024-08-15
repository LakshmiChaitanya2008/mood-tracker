import React from "react";
import { fugaz_One } from "./layout";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function Page() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  return (
    <div className="max-w-4xl mx-auto mt-10">
      <nav
        className={`${fugaz_One.className} flex justify-between items-center`}
      >
        <h1 className="text-3xl ">Mood Tracker</h1>
        <div className="flex gap-6">
          {!data?.user ? (
            <>
              <Link href="/auth/signup">
                <button className="border-2 border-primary py-3 px-8 rounded-2xl">
                  Sign Up
                </button>
              </Link>
              <Link href="/auth/login">
                <button className="bg-primary text-white py-3 px-8 rounded-2xl">
                  Login
                </button>
              </Link>
            </>
          ) : (
            <Link href="/dashboard">
              <button className="bg-primary text-white py-3 px-8 rounded-2xl">
                Dashboard
              </button>
            </Link>
          )}
        </div>
      </nav>
      <section className="mt-12 text-center">
        <div>
          <h1 className={`text-4xl pb-10 ${fugaz_One.className}`}>
            <span className="text-primary">Understand</span> Yourself{" "}
            <span className="text-primary">Better</span>, Feel{" "}
            <span className="text-primary">Better</span>.{" "}
          </h1>
        </div>
        <Image
          src="/home_ill.svg"
          alt="Illustration"
          width={325}
          height={325}
          className="mx-auto"
        />
      </section>
    </div>
  );
}
