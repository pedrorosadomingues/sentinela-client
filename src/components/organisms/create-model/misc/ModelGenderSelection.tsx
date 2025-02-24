import {
  ModelCustomizationsProps,
  useCreateModelStore,
} from "@/stores/createModelStore";
import Image from "next/image";
import React from "react";

export function ModelGenderSelection() {
  const {
    selectedModel,
    setSelectedModel,
    setSelectedCustomizations,
    selectedCustomizations,
  } = useCreateModelStore();

  const models = [
    {
      key: "model-1",
      name: "Model 1",
      image: "/icons/model-generator/male-person.svg",
    },
    {
      key: "model-2",
      name: "Model 2",
      image: "/icons/model-generator/female-person.svg",
    },
  ];

  const handleSelectModel = (key: string) => {
    if (selectedModel === key) {
      setSelectedModel(null);

      setSelectedCustomizations({
        ...selectedCustomizations,
        gender: null,
      });

      return;
    }

    setSelectedModel(key);
    setSelectedCustomizations({
      ...selectedCustomizations,
      gender:
        key === "model-1"
          ? "male"
          : ("female" as ModelCustomizationsProps["gender"]),
    });
  };

  return (
    <article className="flex flex-col items-center gap-6">
      <ul className="flex gap-6 md:gap-8 flex-wrap justify-center">
        {models.map((model) => (
          <li
            key={model.key}
            className="cursor-pointer group text-center"
            onClick={() => handleSelectModel(model.key)}
          >
            <div
              className={`bg-white border-4
             group-hover:border-secondary/50 transition-all ease-soft-spring rounded-full p-4
             ${
               selectedModel === model.key
                 ? "border-secondary"
                 : "border-default-200"
             }
                  `}
            >
              <Image
                src={model.image}
                alt={model.name}
                className={`group-hover:opacity-80 transition-all ease-soft-spring 
              ${selectedModel === model.key ? "opacity-100" : "opacity-30"}
                `}
                width={72}
                height={72}
              />
            </div>
            {/* <h3
            className={`text-sm md:text-lg mt-2 font-medium group-hover:text-secondary/50 ${
              selectedModel === model.key
              ? "text-secondary"
              : "text-default-900"
              }`}
              >
              {model.name}
              </h3> */}
          </li>
        ))}
      </ul>

      <p className="text-sm lg:text-base w-2/3 text-center">
        Selecione um modelo base para começar a personalização
      </p>
    </article>
  );
}
