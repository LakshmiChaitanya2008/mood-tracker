"use client";
import { createClient } from "@/utils/supabase/client";
import { Fugaz_One } from "next/font/google";
import React, { useEffect, useState } from "react";
import { VscChevronLeft, VscChevronRight } from "react-icons/vsc";

const fugaz_One = Fugaz_One({ subsets: ["latin"], weight: ["400"] });
const months = {
  January: "Jan",
  February: "Feb",
  March: "Mar",
  April: "Apr",
  May: "May",
  June: "Jun",
  July: "Jul",
  August: "Aug",
  September: "Sept",
  October: "Oct",
  November: "Nov",
  December: "Dec",
};
const monthsArr = Object.keys(months);
const dayList = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const supabase = createClient();

const moodEmojis: { [key: number]: string } = {
  1: "😭",
  2: "😔",
  3: "😶",
  4: "😁",
  5: "😍",
};

export default function Calendar() {
  const [moods, setMoods] = useState<any[]>([]);

  useEffect(() => {
    const getMoods = async function () {
      const user = await supabase.auth.getUser();

      const moods = await supabase
        .from("UserMood")
        .select("created_at, moodId")
        .eq("userId", user.data.user?.id);

      const formattedMoods = moods.data!.map((mood) => {
        const date = new Date(mood.created_at);
        return {
          day: date.getDate(),
          month: date.getMonth(),
          year: date.getFullYear(),
          moodId: mood.moodId,
        };
      });

      setMoods(formattedMoods);
    };
    getMoods();
  }, []);

  const now = new Date();
  const currMonth = now.getMonth();
  const [selectedMonth, setSelectMonth] = useState(monthsArr[currMonth]);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const numericMonth = monthsArr.indexOf(selectedMonth);

  function handleIncrementMonth(val: number) {
    if (numericMonth + val < 0) {
      setSelectedYear((curr) => curr - 1);
      setSelectMonth(monthsArr[monthsArr.length - 1]);
    } else if (numericMonth + val > 11) {
      setSelectedYear((curr) => curr + 1);
      setSelectMonth(monthsArr[0]);
    } else {
      setSelectMonth(monthsArr[numericMonth + val]);
    }
  }

  const monthNow = new Date(selectedYear, numericMonth, 1);
  const firstDayOfMonth = monthNow.getDay();
  const daysInMonth = new Date(selectedYear, numericMonth + 1, 0).getDate();
  const daysToDisplay = firstDayOfMonth + daysInMonth;
  const numRows = Math.floor(daysToDisplay / 7) + (daysToDisplay % 7 ? 1 : 0);

  return (
    <div className="flex flex-col gap-2 w-full max-w-3xl mx-auto mt-16">
      <div className="grid grid-cols-5 gap-4">
        <button
          onClick={() => handleIncrementMonth(-1)}
          className="mr-auto text-indigo-400 text-lg sm:text-xl duration-200 hover:bg-primary rounded-full hover:p-1 hover:text-white"
        >
          <VscChevronLeft />
        </button>
        <p
          className={`text-center col-span-3 ${fugaz_One.className} text-primary text-xl`}
        >
          {selectedMonth}, {selectedYear}
        </p>
        <button
          onClick={() => handleIncrementMonth(+1)}
          className="ml-auto text-indigo-400 text-lg sm:text-xl duration-200 hover:bg-primary rounded-full hover:p-1 hover:text-white"
        >
          <VscChevronRight />
        </button>
      </div>
      <div
        className={`flex flex-col overflow-hidden gap-1 py-4 italic ${fugaz_One.className}`}
      >
        {[...Array(numRows).keys()].map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-7 gap-1">
            {dayList.map((dayOfWeek, dayOfWeekIndex) => {
              let dayIndex =
                rowIndex * 7 + dayOfWeekIndex - (firstDayOfMonth - 1);
              let dayDisplay =
                dayIndex > daysInMonth
                  ? false
                  : rowIndex === 0 && dayOfWeekIndex < firstDayOfMonth
                  ? false
                  : true;
              let isToday =
                dayDisplay &&
                dayIndex === now.getDate() &&
                numericMonth === now.getMonth() &&
                selectedYear === now.getFullYear();

              const moodForDay = moods.find(
                (mood) =>
                  mood.day === dayIndex &&
                  mood.month === numericMonth &&
                  mood.year === selectedYear
              );
              const moodEmoji = moodForDay
                ? moodEmojis[moodForDay.moodId]
                : null;

              return (
                <div
                  key={dayOfWeekIndex}
                  className={`text-xs sm:text-sm border border-solid p-2 flex items-center gap-2 justify-between rounded-lg ${
                    isToday ? "border-2 border-indigo-400" : "border-gray-100"
                  } ${
                    dayDisplay
                      ? moodForDay
                        ? "bg-primary text-white"
                        : "bg-white"
                      : "bg-transparent"
                  }`}
                >
                  {dayDisplay ? (
                    <p className="not-italic">
                      {dayIndex} {moodEmoji}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
