import { forwardRef } from "react";
import { FormSelectInputProps } from "@/types/generate-form";
import Select from "@/components/organisms/ui/Select";
import { useFnStore } from "@/stores/fnStore";
import { useTranslations } from "next-intl";

const SelectEngine = forwardRef<HTMLSelectElement, FormSelectInputProps>(
  ({ setValue, name, options, ...rest }, ref) => {
    const t = useTranslations('functions.inputs');
    const { setSelectedEngine } = useFnStore();

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedValue = event.target.value;
      setSelectedEngine(selectedValue);
      setValue(name, selectedValue);
    };

    return (
      <Select
        {...rest}
        label={t('engine_label')}
        options={options}
        onChange={handleChange}
        ref={ref}
      />
    );
  }
);

SelectEngine.displayName = "SelectEngine";

export default SelectEngine;
