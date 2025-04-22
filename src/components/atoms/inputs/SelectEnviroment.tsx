import OptionProps from "@/interfaces/OptionProps";
import { forwardRef } from "react";
import { FormSelectInputProps } from "@/types/generate-form";
import Select from "@/components/organisms/ui/Select";
import { useTranslations } from "next-intl";

const SelectEnvironment = forwardRef<HTMLSelectElement, FormSelectInputProps>(({
  ...rest
}, ref) => {
  const t = useTranslations('functions.inputs');

  const options: OptionProps[] = [
    {
      title: "Interior",
      value: "interior",
    },
    {
      title: "Exterior",
      value: "exterior",
    },
  ];

  return (
    <Select
      {...rest}
      label={t('environment_label')}
      options={options}
      ref={ref}
    />
  );
});

SelectEnvironment.displayName = "SelectEnvironment";

export default SelectEnvironment;
