import { AutocompleteSelectProps } from "@/types/generate-form";
import { Autocomplete, AutocompleteItem, Chip } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { forwardRef } from "react";

const AutocompleteSelect = forwardRef<
  HTMLInputElement,
  AutocompleteSelectProps
>(({ options, ...rest }, ref) => {
  const t = useTranslations("functions.inputs");

  const sortedOptions = options?.sort((a, b) => {
    if (a.value === "") return -1;

    return a.title.localeCompare(b.title);
  });

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
      {t("new")}
    </Chip>
  );

  return (
    <Autocomplete
      {...rest}
      ref={ref}
      allowsCustomValue
      labelPlacement="outside"
      placeholder={t("select_placeholder")}
      variant="bordered"
      listboxProps={{
        emptyContent: t("no_options_found"),
      }}
      defaultItems={sortedOptions ?? []}
    >
      {(item) => (
        <AutocompleteItem key={item.value} textValue={item.title}>
          <div className="flex items-center">
            {item.title}
            {item.new && <NewChip />}
          </div>
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
});

AutocompleteSelect.displayName = "AutocompleteSelect";

export default AutocompleteSelect;
