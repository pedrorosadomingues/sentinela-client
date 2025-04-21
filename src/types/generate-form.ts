import OptionProps from "@/interfaces/OptionProps";
import { AutocompleteProps, InputProps, SelectProps } from "@nextui-org/react";

export type FormSelectInputProps = Omit<SelectProps<HTMLSelectElement>, "children"> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue?: any;
  options?: OptionProps[];
};

export type AutocompleteSelectProps = Omit<AutocompleteProps<HTMLInputElement>, "children"> & {
  options: SelectOptionsProps[];
};

export type SelectOptionsProps = {
  title: string;
  value: string;
  tooltip?: string;
  disabled?: boolean;
  new?: boolean;
};

export const FormSelectInputMutualProps: Partial<SelectProps<HTMLSelectElement>> = {
  variant: "bordered",
  className: "w-full text-primary",
  labelPlacement: "outside",
};

export type FormTextInputProps = InputProps;
