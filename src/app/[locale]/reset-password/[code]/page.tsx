"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ConfirmationButton from "@/components/atoms/ConfirmationButton";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await response.json();
    setLoading(false);
    setMessage(data.message);

    if (response.ok) {
      setTimeout(() => router.push("/login"), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold">Redefinir Senha</h2>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
        <input
          type="password"
          placeholder="Nova Senha"
          className="border p-2 rounded"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <ConfirmationButton
          color="primary"
          size="md"
          isLoading={loading}
          onClick={() => handleSubmit}
        >
          {loading ? "Aguarde..." : "Redefinir Senha"}
        </ConfirmationButton>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
