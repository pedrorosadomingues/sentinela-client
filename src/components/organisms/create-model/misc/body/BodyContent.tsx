import React from "react";
import { Shape, Skin, Height, Age } from "./misc";

export default function BodyContent() {
  return (
    <div className="flex flex-col space-y-6">
      <Age />
      <Shape />
      <Height />
      <Skin />
    </div>
  );
}
