import { forwardRef } from "react";
import { AutocompleteSelectProps } from "@/types/generate-form";
import AutocompleteSelect from "@/components/organisms/ui/AutocompleteSelect";
import { useTranslations } from "next-intl";

const SelectType = forwardRef<HTMLInputElement, AutocompleteSelectProps>(({
  options,
  ...rest
}, ref) => {
  const t = useTranslations('functions.inputs');

  return (
    <AutocompleteSelect
      {...rest}
      ref={ref}
      options={options}
      label={t('type_label')}
    />
  );

});

SelectType.displayName = "SelectType";

export default SelectType;
