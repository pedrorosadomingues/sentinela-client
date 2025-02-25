// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useLocale, useTranslations } from "next-intl";
// import { useEffect, useState } from "react";
// import { login } from "@/services";
// import { toast } from "react-toastify";
// import { redirect, useRouter } from "next/navigation";
// import RootBanner from "@/components/organisms/RootBanner";
// import SignInForm from "@/components/organisms/DynamicForm";
// import { z } from "zod";
// import { SubmitHandler, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useUserStore } from "@/stores";
// import { UserProps } from "@/interfaces";

// export default function LoginTemplate(): JSX.Element {
//   const locale = useLocale();
//   const router = useRouter();
//   const text = useTranslations("sign_in_page");
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [serverError, setServerError] = useState<Record<string, string> | null>(
//     null
//   );
//   const { getUser } = useUserStore();

//   const login_schema = z.object({
//     email: z.string().email(text("invalid_email")),
//     password: z.string().min(6, text("password_min_length")),
//   });

//   type LoginFormValues = z.infer<typeof login_schema>;

//   const {
//     formState: { errors },
//   } = useForm<LoginFormValues>({
//     resolver: zodResolver(login_schema),
//   });

//   const handleLogin: SubmitHandler<LoginFormValues> = async (values) => {
//     setIsLoading(true);
//     setServerError(null);

//     try {
//       const response = await login(values);

//       if (response.status === 200) {
//         const user: UserProps = response.data.user;

//         await getUser(user.id).then(() => {
//           router.push("/main");
//         });
//       }

//       if (response.message && response.message?.name === "UserNotVerifiedError") {
//         setServerError({ general: text("user_not_verified") });
//       }

//       if (response.message && response.message?.name === "InvalidCredentialsError") {
//         setServerError({ general: text("invalid_email_or_password") });
//       }
//     } catch (error: any) {
//       console.error("Erro de login:", error);

//       if (error.response?.status === 401) {
//         setServerError({
//           email: text("invalid_email_or_password"),
//           password: text("invalid_email_or_password"),
//         });
//       } else {
//         toast.error("Erro inesperado ao fazer login.");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen w-screen flex items-center">
//       <SignInForm<LoginFormValues>
//         title={text("login")}
//         subtitle={text("access_message")}
//         forgot_password_link={text("forgot_password")}
//         signup_text={text("sign_up_here")}
//         no_account_text={text("dont_have_account")}
//         button_text={text("login") + ">>"}
//         schema={login_schema}
//         onSubmit={handleLogin}
//         isLoading={isLoading}
//         fields={[
//           {
//             name: "email",
//             label: text("email"),
//             type: "email",
//             required: true,
//             error: errors.email?.message as string,
//           },
//           {
//             name: "password",
//             label: text("password"),
//             type: "password",
//             required: true,
//             error: errors.password?.message as string,
//           },
//         ]}
//         server_error={serverError}
//       />

//       <div className="rounded-l-[60px] bg-primary-background h-screen w-[50%] flex items-center justify-center max515:hidden">
//         <RootBanner />
//       </div>
//     </div>
//   );
// }
