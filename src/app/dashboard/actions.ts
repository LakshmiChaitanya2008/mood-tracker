"use server";

import { createClient } from "@/utils/supabase/server";

const supabase = createClient();

export async function setMood(mood: number) {
  const { data, error } = await supabase.auth.getUser();

  await supabase
    .from("UserMood")
    .insert({ userId: data.user?.id, moodId: mood });
}
