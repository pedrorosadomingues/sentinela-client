"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { code } = useParams();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const body = JSON.stringify({ code, newPassword });

      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });

      const data = await response.json();
      setLoading(false);
      setMessage(data.message);

      if (response.ok) {
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch (error) {
      console.error(error);
      setMessage("Erro ao redefinir senha.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-screen">
      <div className="flex flex-col justify-center px-10 w-[60%] bg-white">
        <Image
          src="/images/logo-vestiq.png"
          alt="Vestiq Logo"
          width={150}
          height={250}
          priority
          className="mb-6"
        />

        <h1 className="text-4xl font-bold text-gray-900">
          A inteligência artificial que renova casas e ambiente
        </h1>

        <p className="text-gray-600 mt-4">
          Explore o melhor da Inteligência Artificial para Arquitetura,
          Engenharia e Design.
        </p>

        <div className="grid grid-cols-2 gap-6 mt-8 text-gray-800">
          <div>
            <h3 className="font-bold text-lg">Renderizar imagem</h3>

            <p className="text-sm">
              Modele imagens incríveis para o seu projeto
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg">Renderize traços</h3>

            <p className="text-sm">
              Modele imagens incríveis para o seu projeto
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg">Gerador de ideias</h3>

            <p className="text-sm">
              Modele imagens incríveis para o seu projeto
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg">Gerar cômodo/mobília</h3>

            <p className="text-sm">
              Modele imagens incríveis para o seu projeto
            </p>
          </div>
        </div>
      </div>

      <div className="w-[40%] flex flex-col justify-center items-center bg-gray-100 p-8">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-900">Redefinir senha</h2>

          <p className="text-gray-600 mt-1 text-sm">
            Redefina sua senha para acessar sua conta.
          </p>

          <div className="flex justify-center my-5">
            <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Nova senha
              </label>

              <input
                type="password"
                placeholder="Digite sua nova senha"
                className="border p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Confirme a nova senha
              </label>

              <input
                type="password"
                placeholder="Digite novamente a senha"
                className="border p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-3 rounded-md font-semibold shadow-md hover:opacity-90 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Aguarde..." : "Confirmar nova senha"}
            </button>

            <button
              type="button"
              className="w-full text-purple-600 font-medium text-sm mt-2 hover:underline"
              onClick={() => router.push("/login")}
            >
              Cancelar solicitação
            </button>
          </form>

          {message && (
            <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
