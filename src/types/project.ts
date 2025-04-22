/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Tables } from "@/lib/supabase/types";

export interface Project extends Tables<'project'> {
    pastes: Tables<'paste'>[];
    generations: Tables<'generation'>[];
    totalFiles: number;
    hidden: boolean;
    total_generations: number;
    total_pastes: number;
};

export interface Folder extends Tables<'paste'> {
    generations: Tables<'generation'>[];
    pastes?: Tables<'paste'>[];
    totalFiles: number;
    total_generations: number;
    total_pastes: number;
};


export interface UserPaste {
    id: number,
    user_id: string,
}

export interface Generation extends Tables<'generation'> {}
