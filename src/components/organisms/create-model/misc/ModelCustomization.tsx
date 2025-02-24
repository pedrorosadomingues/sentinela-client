import { Tab, Tabs } from "@heroui/react";
import React, { useEffect, useState } from "react";
import BodyContent from "./body/BodyContent";
import EyesContent from "./eyes/EyesContent";
import HairContent from "./hair/HairContent";
import { useCreateModelStore } from "@/stores/createModelStore";
import FacialHairContent from "./facial-hair/FacialHairContent";

export function ModelCustomization() {
  const [activeTab, setActiveTab] = useState("body");
  const { selectedModel, selectedCustomizations } = useCreateModelStore();
  const isMaleGender = selectedModel === "model-1";

  useEffect(() => {
    console.log(selectedCustomizations);
  }, [selectedCustomizations]);

  return (
    <Tabs
      aria-label="Options"
      color="secondary"
      variant="underlined"
      selectedKey={activeTab}
      onSelectionChange={(key) => setActiveTab(key as string)}
      className="w-full"
      classNames={{
        tabList: "px-0",
      }}
    >
      <Tab key="body" title="Body" aria-label="body tab" className="w-full">
        <BodyContent />
      </Tab>
      <Tab key="eyes" title="Eyes" aria-label="eyes tab" className="w-full">
        <EyesContent />
      </Tab>
      <Tab key="hair" title="Hair" aria-label="hair tab" className="w-full">
        <HairContent />
      </Tab>
      {isMaleGender && (
        <Tab
          key="facial-hair"
          title="Facial Hair"
          aria-label="facial hair tab"
          className="w-full"
        >
          <FacialHairContent />
        </Tab>
      )}
    </Tabs>
  );
}
