"use client";
import React, { useEffect, useState } from "react";
import { Fugaz_One } from "next/font/google";

const fugaz = Fugaz_One({ weight: "400", subsets: ["latin"] });

export default function MoodInfo({
  moods,
  moodsArr,
  isTodayMoodSet,
}: {
  moods: any[];
  moodsArr: string[];
  isTodayMoodSet: boolean;
}) {
  const calculateHighestStreak = (moods: any[]): number => {
    if (moods.length === 0) return 0;
    moods.sort(
      (a, b) =>
        +new Date(a.year, a.month, a.day) - +new Date(b.year, b.month, b.day)
    );

    let maxStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < moods.length; i++) {
      const prevDate = new Date(
        moods[i - 1].year,
        moods[i - 1].month,
        moods[i - 1].day
      );
      const currentDate = new Date(moods[i].year, moods[i].month, moods[i].day);

      if (currentDate.getTime() - prevDate.getTime() === 86400000) {
        currentStreak++;
      } else {
        maxStreak = Math.max(maxStreak, currentStreak);
        currentStreak = 1;
      }
    }

    return Math.max(maxStreak, currentStreak);
  };

  const calculateAverageMood = (moods: any[], moodsArr: string[]): string => {
    if (moods.length === 0) return "N/A";

    const totalMoodScore = moods.reduce((acc, mood) => acc + mood.moodId, 0);
    const averageMoodIndex = Math.round(totalMoodScore / moods.length) - 1;

    return moodsArr[averageMoodIndex] || "N/A";
  };

  const highestStreak = calculateHighestStreak(moods);
  const averageMood = calculateAverageMood(moods, moodsArr);
  const totalMoods = moods.length;

  return (
    <div
      className={`bg-purple-200 my-6 flex items-center text-center justify-evenly py-6 rounded-lg ${fugaz.className}`}
    >
      <div>
        <span className="text-4xl">{highestStreak} 🔥</span>
        <div>Streak</div>
      </div>
      <div>
        <span className="text-4xl">{averageMood}</span>
        <div>Average Mood</div>
      </div>
      <div>
        <span className="text-4xl">{totalMoods}</span>
        <div>Total Moods Stored</div>
      </div>
    </div>
  );
}
