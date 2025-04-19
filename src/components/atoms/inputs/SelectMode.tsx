import { forwardRef } from "react";
import { FormSelectInputProps } from "@/types/generate-form";
import Select from "@/components/organisms/ui/Select";
import { useTranslations } from "next-intl";

const SelectMode = forwardRef<HTMLSelectElement, FormSelectInputProps>(({
  options,
  ...rest
}, ref) => {
  const t = useTranslations('functions.inputs');

  return (
    <Select
      {...rest}
      label={t('mode_label')}
      options={options}
      ref={ref}
    />
  );

});

SelectMode.displayName = "SelectMode";

export default SelectMode;
