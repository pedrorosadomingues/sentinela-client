"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setMessage(
        data.message || "Se o e-mail estiver cadastrado, você receberá um link."
      );
    } catch (error) {
      console.error(error);
      setMessage("Erro ao solicitar redefinição de senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
        {/* Logo da Vestiq */}
        <Image
          src="/images/logo-vestiq.png"
          alt="Vestiq Logo"
          className="mx-auto w-28 mb-4"
        />

        <h2 className="text-2xl font-bold text-gray-800">
          Esqueci minha senha
        </h2>
        <p className="text-gray-600 mt-2 text-sm">
          Insira seu endereço de e-mail abaixo. Você receberá um link para
          redefinir sua senha diretamente no seu e-mail.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div className="text-left">
            <label className="text-sm font-medium text-gray-700">E-mail</label>
            <input
              type="email"
              placeholder="Digite seu e-mail"
              className="border p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="flex justify-center items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-md font-semibold shadow-md hover:opacity-90 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar email"}
            {!loading && <span className="ml-1">»</span>}
          </button>
        </form>

        {message && <p className="mt-4 text-gray-700 text-sm">{message}</p>}

        <button
          onClick={() => router.push("/login")}
          className="text-purple-600 text-sm font-medium mt-4 hover:underline"
        >
          Voltar para o Login
        </button>
      </div>
    </div>
  );
}
