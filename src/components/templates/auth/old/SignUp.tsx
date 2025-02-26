// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useLocale, useTranslations } from "next-intl";
// import { useState } from "react";
// import { signUp } from "@/services/user/sign-up";
// import RootBanner from "@/components/organisms/RootBanner";
// import SignUpForm from "@/components/organisms/DynamicForm";
// import { z } from "zod";
// import { SubmitHandler, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useGlobalStore } from "@/stores";

// export default function SignUpTemplate(): JSX.Element {
//   const locale = useLocale();

//   const text = useTranslations("sign_up_page");

//   const { setRootControl, setEmailSended } = useGlobalStore();

//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   const [serverError, setServerError] = useState<Record<string, string> | null>(
//     null
//   );

//   const signUpSchema = z.object({
//     name: z.string().min(3, text("name_min_length")),

//     email: z.string().email(text("invalid_email")),

//     password: z.string().min(6, text("password_min_length")),

//     password_confirmation: z.string().min(6, text("password_min_length")),
//   });

//   type SignUpFormValues = z.infer<typeof signUpSchema>;

//   const {
//     formState: { errors },
//   } = useForm<SignUpFormValues>({
//     resolver: zodResolver(signUpSchema),
//   });

//   const handleSignUp: SubmitHandler<SignUpFormValues> = async (values) => {
//     setIsLoading(true);

//     setServerError(null);

//     try {
//       if (values.password !== values.password_confirmation) {
//         setServerError({ general: text("passwords_dont_match") });

//         return;
//       }
//       const response = await signUp({ ...values, locale });

//       if (response.status === 409) {
//         setServerError({ general: text("email_already_registered") });
//       }

//       if (response.message?.error?.name === "UserNotVerifiedError") {
//         setServerError({ general: text("user_not_verified") });
//       }

//       if (response.status === 200) {
//         setRootControl("success-email-sended");

//         setEmailSended("register");
//       }
//     } catch (error: any) {
//       console.error("Erro de cadastro:", error);

//       if (error?.response?.status === 409) {
//         setServerError({ general: text("email_already_registered") });
//       }

//       if (error?.response?.status === 500) {
//         setServerError({ general: text("unexpected_error") });
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen w-screen flex items-center">
//       <SignUpForm<SignUpFormValues>
//         title={text("sign_up")}
//         button_text={text("register")}
//         have_account_text={text("have_account")}
//         back_login_text={text("back_to_login")}
//         schema={signUpSchema}
//         onSubmit={handleSignUp}
//         isLoading={isLoading}
//         fields={[
//           {
//             name: "name",
//             label: text("name"),
//             type: "text",
//             required: true,
//             error: errors.name?.message as string,
//           },
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
//           {
//             name: "password_confirmation",
//             label: text("password_confirmation"),
//             type: "password",
//             required: true,
//             error: errors.password_confirmation?.message as string,
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
