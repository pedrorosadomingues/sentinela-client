import {
  Chip,
  Select as NextuiSelect,
  SelectItem,
  Tooltip,
} from "@nextui-org/react";
import { InfoOutlined } from "@mui/icons-material";
import { forwardRef } from "react";
import {
  FormSelectInputMutualProps,
  FormSelectInputProps,
} from "@/types/generate-form";
import { useTranslations } from "next-intl";

const Select = forwardRef<HTMLSelectElement, FormSelectInputProps>(
  ({ options, classNames, ...rest }, ref) => {
    const t = useTranslations("functions.inputs");

    const NewChip = () => (
      <Chip
        variant="shadow"
        size="sm"
        className="ml-2 animate-pulse"
        classNames={{
          base: "bg-amethyst-blue-gradient border-white/50 shadow-blue-500/30",
          content: "drop-shadow shadow-black text-white",
        }}
      >
        {t('new')}
      </Chip>
    );

    return (
      <NextuiSelect
        {...rest}
        {...FormSelectInputMutualProps}
        placeholder={t("select_placeholder")}
        ref={ref}
        classNames={{
          ...classNames,
          label: "text-font font-medium",
        }}
        disallowEmptySelection
      >
        {(options || []).map((option) => (
          <SelectItem key={option.value} textValue={option.title as string}>
            {option.title}

            {option.new && <NewChip />}
            {option.tooltip && (
              <Tooltip
                content={option.tooltip}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="pointer-events-auto"
                color="foreground"
              >
                <InfoOutlined className="opacity-25 ml-2" fontSize="small" />
              </Tooltip>
            )}
          </SelectItem>
        ))}
      </NextuiSelect>
    );
  }
);

Select.displayName = "Select";

export default Select;
