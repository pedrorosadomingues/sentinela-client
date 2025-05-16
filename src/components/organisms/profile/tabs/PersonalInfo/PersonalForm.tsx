"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useUserStore } from "@/stores";
import Image from "next/image";

export default function PersonalForm() {
  const { user } = useUserStore();
  const [isEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user && "name" in user ? user.name : "",
    birthDate: "",
    document: "",
  });

//   const onUpdate = (data: any) => {
//     console.log(data);
//   };

//   const onChangePassword = () => {
//     console.log("Change password");
//   };

//   const onUploadImage = (file: File) => {
//     console.log(file);
//   };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       onUploadImage(file);
//     }
//   };

//   const handleSave = () => {
//     onUpdate(formData);
//     setIsEditing(false);
//   };

  return (
    <div className="bg-white shadow-lg rounded-lg w-full p-6">
      {/* Título */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dados pessoais</h1>

      {/* Foto de Perfil */}
      <div className="flex items-center mb-6">
        <div className="flex-shrink-0">
          {user && "profileImage" in user ? (
            <Image
              src={user?.profileImage as string}
              width={80}
              height={80}
              className="rounded-full"
              alt=""
            />
          ) : (
            <div className="w-20 h-20 bg-gray-200 rounded-full flex justify-center items-center text-gray-500 text-xl font-bold">
              {user && "name" in user ? user.name[0] : ""}
            </div>
          )}
        </div>
        {/* <div className="ml-4">
          <p className="text-gray-500 text-sm mb-2">
            400px, JPG ou PNG, max 1MB
          </p>
          <label
            htmlFor="upload"
            className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-blue-600"
          >
            Carregar imagem
          </label>
          <input
            id="upload"
            type="file"
            onChange={handleImageUpload}
            className="hidden"
            accept="image/png, image/jpeg"
          />
        </div> */}
      </div>

      {/* Tabs */}
      <div className="border-b mb-6">
        <nav className="flex space-x-6">
          <button className="text-blue-500 font-medium border-b-2 border-blue-500 pb-2">
            Dados Pessoais
          </button>
          {/* <button className="text-gray-500 font-medium pb-2">
            Informações de Contato
          </button>
          <button className="text-gray-500 font-medium pb-2">
            Dados Profissionais
          </button> */}
        </nav>
      </div>

      {/* Formulário */}
      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nome e sobrenome
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            />
          </div>
          <div>
            <label
              htmlFor="birthDate"
              className="block text-sm font-medium text-gray-700"
            >
              Data de nascimento
            </label>
            <input
              type="text"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
              placeholder="DD/MM/AAAA"
              disabled={!isEditing}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            />
          </div>
          <div>
            <label
              htmlFor="document"
              className="block text-sm font-medium text-gray-700"
            >
              Documento
            </label>
            <input
              type="text"
              id="document"
              name="document"
              value={formData.document}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            />
          </div>
        </div>

        {/* <div className="flex space-x-4 mt-6">
          {isEditing ? (
            <button
              type="button"
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-600"
            >
              Salvar alterações
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-600"
            >
              Editar informações
            </button>
          )}
          <button
            type="button"
            onClick={onChangePassword}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-300"
          >
            Alterar a senha
          </button>
        </div> */}
      </form>
    </div>
  );
}
