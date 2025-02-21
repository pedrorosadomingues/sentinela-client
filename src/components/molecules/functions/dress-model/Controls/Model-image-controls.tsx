/* eslint-disable @typescript-eslint/no-unused-vars */
import { Control, UseFormSetValue, useWatch } from "react-hook-form";
import { getCheckboxOptions } from "@/constants/options";
import { useLocale, useTranslations } from "next-intl";
import ToolInfo from "@/components/atoms/ToolInfo";
import { Accordion, AccordionItem, Switch } from "@heroui/react";
import { useState } from "react";
import { FormValues } from "@/interfaces";
import { useDressModelStore } from "@/zustand-stores/dressModelStore";

interface Props {
  control: Control<FormValues>;
  setValue: UseFormSetValue<FormValues>;
}

export default function ModelImageControls({ control, setValue }: Props) {
  const [openKeys, setOpenKeys] = useState<Set<string>>(new Set(["1"]));
  const { modelImageControls, setModelImageControls } = useDressModelStore();
  const text = useTranslations("model_image_controls");
  const locale = useLocale();
  const CHECKBOX_OPTIONS = getCheckboxOptions(locale);
  // Monitorando os valores do formulário em tempo real
  const values = useWatch({ control });

  const handleChange = (name: keyof FormValues, value: boolean) => {
    if (values[name] !== value) {
      setValue(name, value);
      setModelImageControls({ ...modelImageControls, [name]: value });
    }
  };

  return (
    <Accordion
      className="dt-eighth-step"
      selectedKeys={openKeys}
      onSelectionChange={(keys) =>
        setOpenKeys(new Set(Array.from(keys).map(String)))
      }
    >
      <AccordionItem
        key="1"
        aria-label={text("title")}
        title={text("title")}
        keepContentMounted
      >
        <div className="flex flex-col gap-2">
          {CHECKBOX_OPTIONS.map((option) => (
            <div className="flex items-center gap-2" key={option.name}>
              <Switch
                name={option.name}
                size="sm"
                color="secondary"
                onValueChange={(e) =>
                  handleChange(option.name as keyof FormValues, e)
                }
                defaultSelected={
                  values[option.name as keyof FormValues] as boolean
                }
              >
                {option.label}
              </Switch>
              <ToolInfo
                title={option.label}
                text={option.description as string}
                href="https://academy.arch.redraw.pro/"
              />
            </div>
          ))}
        </div>
      </AccordionItem>
    </Accordion>
  );
}
