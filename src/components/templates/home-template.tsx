/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Image from "next/image";
import { useFormik } from "formik";
import { Button, FilledInput, TextField } from "@mui/material";
import { useState } from "react";
import { createGeneration } from "@/services";
// import en from "../../public/locales/en/login.json";
// import ptBR from "../../public/locales/pt-br/login.json";

export default function HomeTemplate() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [image_path, setImagePath] = useState<string>("/img/logo.png");

  const formik = useFormik({
    initialValues: {
      category: "",
      model_image: "",
      garment_image: "",
      fn: "",
    },
    onSubmit: async () => {
      const payload = {
        category: formik.values.category,
        model_image: formik.values.model_image,
        garment_image: formik.values.garment_image,
        fn: formik.values.fn,
      };

      console.log("payload", payload);

      setIsLoading(true);
      try {
        const response = await createGeneration(payload);

        console.log("response", response);

        if (response.status === 200) {
          alert("Generate created successfully");
        } else {
          alert(
            "Error creating user:" + JSON.stringify(response.message?.message)
          );
        }
      } catch (error) {
        console.log("Erro inesperado:", error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name } = event.target;
    const files = event.target.files;

    if (files && files[0]) {
      const file = files[0];

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
          `http://localhost:3000/upload/generate-presigned-url?${queryParams}`,
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

        console.log("uploadUrl", uploadUrl);
        setImagePath(URL.createObjectURL(file));

        console.log("image_path:", image_path);

        formik.setFieldValue(name, uploadUrl);
      } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error);
      }
    }
  };

  return (
    <div className="bg-primary min-h-screen min-w-[40%] max-w-lg flex justify-center items-center flex-col">
      <Image
        src={"/img/logo.png"}
        alt="Redraw logo"
        width={150}
        height={250}
        priority={true}
      />
      <div className="mt-10 p-10 rounded-xl bg-slate-100 w-full max-w-md">
        <form onSubmit={formik.handleSubmit} className="flex flex-col">
          <div>
            <Image
              src={image_path}
              alt="Redraw logo"
              width={150}
              height={250}
              priority={true}
            />
            <input
              type="file"
              name="model_image"
              onChange={handleFileChange}
              accept="image/*"
            />
            <label className="mb-5">Model Image</label>
          </div>
          <div className="mb-5">
            <input
              type="file"
              name="garment_image"
              onChange={handleFileChange}
              accept="image/*"
            />
            <label className="mb-5">Garment Image</label>
          </div>
          <div className="mb-5">
            <TextField
              label="Category"
              variant="filled"
              name="category"
              onChange={formik.handleChange}
              value={formik.values.category}
              className="w-full"
              type="text"
              required
            />
          </div>
          <div className="mb-5">
            <TextField
              label="Fn"
              variant="filled"
              name="fn"
              onChange={formik.handleChange}
              value={formik.values.fn}
              className="w-full"
              type="text"
              required
            />
          </div>
          <div className="ml-auto mb-5">
            <Button type="submit" variant="contained" disabled={isLoading}>
              Register
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
