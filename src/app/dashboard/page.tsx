"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Calender from "@/components/Calender";
import { Fugaz_One } from "next/font/google";
import { setMood } from "./actions";
import { createClient } from "@/utils/supabase/client";
import MoodInfo from "@/components/MoodInfo";
import { useRouter } from "next/navigation";

const supabase = createClient();
const fugaz_One = Fugaz_One({ weight: "400", subsets: ["latin"] });

export default function Page() {
  const moodsArr = ["😭", "😔", "😶", "😁", "😍"];
  const [moods, setMoods] = useState<any[]>([]);
  const [todayMood, setTodayMood] = useState<number | null>(null);
  const [isTodayMoodSet, setIsTodayMoodSet] = useState(false);
  const router = useRouter();
  const fetchMoods = async () => {
    const user = await supabase.auth.getUser();
    const today = new Date();
    const todayDate = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();

    const { data: moodsData, error } = await supabase
      .from("UserMood")
      .select("created_at, moodId")
      .eq("userId", user.data.user?.id);

    if (error) {
      console.error("Error fetching moods:", error);
      return;
    }

    const formattedMoods = moodsData.map((mood: any) => {
      const date = new Date(mood.created_at);
      return {
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        moodId: mood.moodId,
      };
    });

    setMoods(formattedMoods);

    // Check if today’s mood is set
    const todayMoodEntry = formattedMoods.find(
      (mood) =>
        mood.day === todayDate &&
        mood.month === todayMonth &&
        mood.year === todayYear
    );
    if (todayMoodEntry) {
      setTodayMood(todayMoodEntry.moodId);
      setIsTodayMoodSet(true);
    } else {
      setIsTodayMoodSet(false);
    }
  };

  useEffect(() => {
    fetchMoods();
  }, []);

  const handleMoodSet = async (moodId: number) => {
    const user = await supabase.auth.getUser();
    const { error } = await supabase.from("UserMood").insert([
      {
        userId: user.data.user?.id,
        moodId,
      },
    ]);

    if (error) {
      console.error("Error setting mood:", error);
      return;
    }

    setTodayMood(moodId);
    setIsTodayMoodSet(true);
    fetchMoods(); // Re-fetch moods to update the list
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <nav
        className={`${fugaz_One.className} flex justify-between items-center`}
      >
        <h1 className="text-3xl">Mood Tracker</h1>
        <div className="flex gap-6">
          <Link href="/dashboard">
            <button
              className="border-2 border-primary py-3 px-8 rounded-2xl"
              onClick={async () => {
                await supabase.auth.signOut();
                router.push("/");
              }}
            >
              Log Out
            </button>
          </Link>
        </div>
      </nav>
      <div>
        <h1 className={`text-4xl ${fugaz_One.className} text-center mt-8`}>
          {isTodayMoodSet ? "Mood set for today!" : "How do you feel today?"}
        </h1>
        <section className="text-5xl flex justify-evenly mt-16">
          {moodsArr.map((m, i) => {
            const isTodayMood = todayMood === i + 1;
            return (
              <button
                key={i}
                className={`p-8 rounded-xl shadow-md ${
                  isTodayMood ? "bg-green-300" : "bg-blue-100 shadow-blue-400"
                } ${
                  isTodayMood || !isTodayMoodSet
                    ? ""
                    : "opacity-50 cursor-not-allowed"
                }`}
                onClick={() => {
                  if (!isTodayMoodSet) {
                    handleMoodSet(i + 1);
                  }
                }}
                disabled={isTodayMoodSet && !isTodayMood}
              >
                {m}
              </button>
            );
          })}
        </section>
        <MoodInfo
          moods={moods}
          isTodayMoodSet={isTodayMoodSet}
          moodsArr={moodsArr}
        />

        <Calender />
      </div>
    </div>
  );
}
