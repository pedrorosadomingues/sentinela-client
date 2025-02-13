/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { verifyEmail } from "@/services";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function VerifyEmailPage() {
  const { locale, email, verification_code } = useParams();

  const router = useRouter();

  const text = useTranslations("verify_email");

  const [verificationStatus, setVerificationStatus] = useState<{
    loading: boolean;
    success: boolean | null;
    message: string;
  }>({
    loading: true,
    success: null,
    message: "",
  });

  useEffect(() => {
    async function verify() {
      if (!email || !verification_code) return;

      const decoded_email = decodeURIComponent(email as string);

      try {
        const response: any = await verifyEmail({
          email: decoded_email,
          verification_code: Number(verification_code),
        } as {
          email: string;
          verification_code: number;
        });
        console.log("Response:", response);
        if (response.status === 200) {
          setVerificationStatus({
            loading: false,
            success: true,
            message: "Seu e-mail foi verificado com sucesso! 🎉",
          });

          // setTimeout(() => {
          //   router.push(`/${locale}`);
          // }, 3000);
        } else {
          console.error(response);
          setVerificationStatus({
            loading: false,
            success: false,
            message: text("code_expired") || "Falha na verificação do e-mail.",
          });
        }
      } catch (error) {
        console.error(error);
        setVerificationStatus({
          loading: false,
          success: false,
          message: "Erro inesperado ao verificar e-mail.",
        });
      }
    }

    verify();
  }, [email, verification_code, locale, router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 px-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
        <Image
          src="/images/logo-vestiq.png"
          alt="Vestiq Logo"
          width={120}
          height={120}
          className="mx-auto mb-6"
        />

        <h1 className="text-2xl font-semibold text-gray-800">
          Verificação de E-mail
        </h1>

        {verificationStatus.loading ? (
          <div className="mt-6">
            <p className="text-gray-600">Verificando seu e-mail...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mt-4"></div>
          </div>
        ) : verificationStatus.success ? (
          <p className="text-green-600 font-medium mt-6">
            {verificationStatus.message}
          </p>
        ) : (
          <div className="mt-6">
            <p className="text-red-600 font-medium">
              {verificationStatus.message}
            </p>
            <button
              onClick={() => router.push("/signup")}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Tentar novamente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
