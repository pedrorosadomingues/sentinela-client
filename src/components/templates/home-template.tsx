/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import { useFormik } from "formik";
import { Button } from "@mui/material";
import { useState, useRef } from "react";
import { createGeneration } from "@/services";
import ModelImageControls from "@/components/molecules/model-image-controls";

export default function HomeTemplate() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [model_image_path, setModelImagePath] = useState<string>("");
  const [garment_image_path, setGarmentImagePath] = useState<string>("");
  const [result_image_path, setResultImagePath] = useState<string>("");

  const modelInputRef = useRef<HTMLInputElement | null>(null);
  const garmentInputRef = useRef<HTMLInputElement | null>(null);

  const categories = [
    { label: "Top", value: "tops" },
    { label: "Bottom", value: "bottoms" },
    { label: "Full-body", value: "one-pieces" },
  ];

  const fnOptions = [
    { label: "Main", value: "main", selectable: true },
    { label: "Render Traces", value: "render_traces", selectable: false },
    { label: "Txt2Img", value: "txt2img", selectable: false },
  ];

  const formik = useFormik({
    initialValues: {
      category: "",
      model_image: "",
      garment_image: "",
      fn: "",
      cover_feet: false,
      adjust_hands: false,
      restore_background: false,
      restore_clothes: false,
    },
    onSubmit: async () => {
      const payload: any = {
        category: formik.values.category,
        model_image: formik.values.model_image,
        garment_image: formik.values.garment_image,
        fn: formik.values.fn,
        cover_feet: formik.values.cover_feet,
        adjust_hands: formik.values.adjust_hands,
        restore_background: formik.values.restore_background,
        restore_clothes: formik.values.restore_clothes,
      };
      console.log("payload", payload);
      setIsLoading(true);

      try {
        const response = await createGeneration(payload);

        const { data: result_image_path } = response;

        if (response.status === 200) {
          setResultImagePath(result_image_path);
        } else {
          alert("Error: " + JSON.stringify(response.message?.message));
        }
      } catch (error) {
        console.log("Erro inesperado:", error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleFileChange = async (file: File, name: string) => {
    try {
      const token = localStorage.getItem("token");

      const file_name = file.name;
      const file_type = file.type;

      const formData = new FormData();
      formData.append("file", file);

      const queryParams = new URLSearchParams({
        file_name,
        file_type,
      }).toString();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_API_BASE_URL}upload/generate-presigned-url?${queryParams}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao obter pre-signed URL");
      }

      const data = await response.json();
      const { uploadUrl }: { uploadUrl: string } = data;

      if (name === "model_image") {
        setModelImagePath(URL.createObjectURL(file));
      } else if (name === "garment_image") {
        setGarmentImagePath(URL.createObjectURL(file));
      }

      formik.setFieldValue(name, uploadUrl);
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
    }
  };

  const handleFileInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name } = event.target;
    const files = event.target.files;

    if (files && files[0]) {
      const file = files[0];
      await handleFileChange(file, name);
    }
  };

  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    type: "model" | "garment"
  ) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];

    if (file) {
      const name = type === "model" ? "model_image" : "garment_image";
      await handleFileChange(file, name);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const openFileDialog = (type: "model" | "garment") => {
    if (type === "model" && modelInputRef.current) {
      modelInputRef.current.click();
    } else if (type === "garment" && garmentInputRef.current) {
      garmentInputRef.current.click();
    }
  };

  return (
    <div className="bg-primary min-h-screen flex justify-center items-center flex-col">
      <Image
        src={"/img/logo.png"}
        alt="Logo"
        width={150}
        height={250}
        priority={true}
      />
      <div className="mt-10 p-10 rounded-xl bg-slate-100 w-full">
        <form onSubmit={formik.handleSubmit} className="flex flex-col">
          {/* Model Image Upload */}
          <div className="flex w-full gap-[30px] justify-center">
            <div className="mb-5">
              <label>Select Model</label>
              <div
                className="upload-area"
                onClick={() => openFileDialog("model")}
                onDrop={(e) => handleDrop(e, "model")}
                onDragOver={handleDragOver}
              >
                {model_image_path ? (
                  <Image
                    src={model_image_path}
                    alt="Model Preview"
                    width={150}
                    height={150}
                  />
                ) : (
                  <p className="text-center w-[70%]">
                    Paste/drop image here OR Choose file
                  </p>
                )}
                <input
                  type="file"
                  name="model_image"
                  onChange={handleFileInputChange}
                  accept="image/*"
                  ref={modelInputRef}
                  hidden
                />
              </div>
            </div>

            {/* Garment Image Upload */}
            <div className="mb-5">
              <label>Select Garment</label>
              <div
                className="upload-area"
                onClick={() => openFileDialog("garment")}
                onDrop={(e) => handleDrop(e, "garment")}
                onDragOver={handleDragOver}
              >
                {garment_image_path ? (
                  <Image
                    src={garment_image_path}
                    alt="Garment Preview"
                    width={150}
                    height={150}
                  />
                ) : (
                  <p className="text-center w-[70%]">
                    Paste/drop image here OR Choose file
                  </p>
                )}
                <input
                  type="file"
                  name="garment_image"
                  onChange={handleFileInputChange}
                  accept="image/*"
                  ref={garmentInputRef}
                  hidden
                />
              </div>
            </div>

            <div className="mb-5">
              <label>Result Image</label>
              <div className="h-min-[420px] result-area">
                {result_image_path ? (
                  <Image
                    src={result_image_path}
                    alt="Garment Preview"
                    width={150}
                    height={150}
                  />
                ) : (
                  <p className="text-center w-[70%]">image</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <ModelImageControls formik={formik} />

            {/*TO DO: COMPONETIZAR - Dynamic Category Buttons */}
            <div>
              <div className="mb-5">
                <label>Category</label>
                <div className="flex gap-3">
                  {categories.map((category) => (
                    <button
                      key={category.value}
                      type="button"
                      onClick={() =>
                        formik.setFieldValue("category", category.value)
                      }
                      className={`p-2 ${
                        formik.values.category === category.value
                          ? "bg-blue-500 text-white"
                          : "bg-gray-300"
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              {/*TO DO: COMPONETIZAR - Dynamic Fn Buttons */}
              <div className="mb-5">
                <label>Fn</label>
                <div className="flex gap-3">
                  {fnOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        option.selectable &&
                        formik.setFieldValue("fn", option.value)
                      }
                      className={`p-2 ${
                        formik.values.fn === option.value
                          ? "bg-blue-500 text-white"
                          : "bg-gray-300"
                      } ${
                        !option.selectable && "opacity-50 cursor-not-allowed"
                      }`}
                      disabled={!option.selectable}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="ml-auto mb-5">
            <Button type="submit" variant="contained" disabled={isLoading}>
              Register
            </Button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .upload-area {
          display: flex;
          justify-content: center;
          align-items: center;
          border: 2px dashed #ccc;
          border-radius: 10px;
          width: 320px;
          height: 320px;
          cursor: pointer;
          text-align: center;
          color: #888;
        }
        .result-area {
          display: flex;
          justify-content: center;
          align-items: center;
          border: 2px dashed #ccc;
          border-radius: 10px;
          width: 320px;
          height: 420px;
          cursor: pointer;
          text-align: center;
          color: #888;
        }
        .upload-area p {
          margin: 0;
        }
        .upload-area:hover {
          border-color: #888;
        }
      `}</style>
    </div>
  );
}
