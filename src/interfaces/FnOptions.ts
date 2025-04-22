/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tables } from "@/lib/supabase/types";
import OptionProps from "./OptionProps";
import React from "react";

export interface FnOptions {
  title: string;
  description: string;
  name: string;
  params: {
    light: OptionProps[];
    type: OptionProps[];
    freedom: OptionProps[];
    weather: OptionProps[];
    style: OptionProps[];
    scenario: OptionProps[];
    daypart: OptionProps[];
    mode: OptionProps[];
    engine: OptionProps[];
  };
  paramsInfo: any;
};

export interface FnProps extends Tables<'image_function'> {
  title: string;
  description: string;
  icon: React.ReactNode;
};

export interface FnsProps extends Tables<'image_function'>, Omit<Tables<'image_function_translations'>, 'description_pt_br' | 'title_pt_br' | 'href_pt_br'> { }
