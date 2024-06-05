import { Database } from "@/types/supabase";
import { createClient } from "@supabase/supabase-js"

export const supabase = createClient<Database>(import.meta.env.VITE_DATABASE_URL, import.meta.env.VITE_ANON_KEY);