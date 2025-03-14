// "use client";

// import { Input } from "@/components/shared/ui/Input";
// import { useToast } from "@/hooks/useToast";
// import axiosClient from "@/lib/axiosClient";
// import { useUserStore } from "@/stores/userStore";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
// import { Button, Tooltip, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
// import { useTranslations } from "next-intl";
// import { useState, useMemo, useEffect } from "react";
// import { SubmitHandler, useForm } from "react-hook-form";
// import { z } from "zod";

// export default function ChangePassword() {
//     const t = useTranslations('profile.personal_info.password');

//     const changePasswordSchema = useMemo(() => z.object({
//         password: z.string().min(8, { message: t('error.password_length') }),
//         confirmPassword: z.string().min(8, { message: t('error.password_length') }),
//     }).refine((data) => data.password === data.confirmPassword, {
//         path: ["confirmPassword"],
//         message: t('error.password_not_match'),
//     }), [t]);

//     type ChangePasswordInputs = z.infer<typeof changePasswordSchema>;

//     const { register, handleSubmit, formState: { errors }, reset } = useForm<ChangePasswordInputs>({
//         defaultValues: { password: '', confirmPassword: '' },
//         resolver: zodResolver(changePasswordSchema),
//     });

//     const { isOpen, onOpen, onOpenChange } = useDisclosure();
//     const { user } = useUserStore();
//     const [isLoading, setIsLoading] = useState(false);
//     const [showPassword, setShowPassword] = useState(false);
//     const toast = useToast();

//     const onSubmit: SubmitHandler<ChangePasswordInputs> = async (data) => {
//         setIsLoading(true);
//         try {
//             await axiosClient.put('/api/auth/update-password', {
//                 user_id: user?.id,
//                 password: data.confirmPassword,
//             });
//             toast.use('success', t("error.success_password_changed"));
//             reset();
//             onOpenChange();
//         } catch (error) {
//             console.error("Erro ao alterar a senha:", error);
//             toast.use('error', t("error.password_change_failed"));
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         reset();
//     }, [isOpen]);

//     const PasswordVisibilityToggle = () => (
//         <Tooltip content={showPassword ? t('hide') : t('show')} color="foreground" placement="top">
//             {showPassword ? (
//                 <VisibilityOffOutlined onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[35px] cursor-pointer text-font-lighter"/>
//             ) : (
//                 <VisibilityOutlined onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[35px] cursor-pointer text-font-lighter"/>
//             )}
//         </Tooltip>
//     );

//     return (
//         <>
//             <Button size="md" className="btn btn-secondary w-fit animate-appearance-in-slow" variant="bordered" onPress={onOpen}>
//                 {t("change_password_title")}
//             </Button>
//             <Modal backdrop="opaque" placement="center" isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
//                 <ModalContent>
//                     <ModalHeader className="flex items-center justify-center">
//                         <h1 className="text-xl text-center font-semibold">{t("change_password_title")}</h1>
//                     </ModalHeader>
//                     <ModalBody as="div">
//                         <form className="flex flex-col gap-4">
//                             <div className="relative">
//                                 <Input
//                                     label={t("new_password")}
//                                     {...register('password')}
//                                     type={showPassword ? "text" : "password"}
//                                     placeholder={t("enter_password_placeholder")}
//                                     className="w-full"
//                                     isInvalid={!!errors.password}
//                                     isDisabled={isLoading}
//                                 />
//                                 <PasswordVisibilityToggle />
//                                 {errors.password && <p className="text-danger text-xs">{errors.password.message}</p>}
//                             </div>
//                             <div className="relative">
//                                 <Input
//                                     label={t("confirm_new_password")}
//                                     {...register("confirmPassword")}
//                                     type={showPassword ? "text" : "password"}
//                                     placeholder={t("repeat_password_placeholder")}
//                                     className="w-full"
//                                     isDisabled={isLoading}
//                                     isInvalid={!!errors.confirmPassword}
//                                 />
//                                 <PasswordVisibilityToggle />
//                                 {errors.confirmPassword && <p className="text-danger text-xs">{errors.confirmPassword.message}</p>}
//                             </div>
//                         </form>
//                     </ModalBody>
//                     <ModalFooter>
//                         <Button variant="bordered" className="flex-1" onPress={onOpenChange} disabled={isLoading}>
//                             {t("cancel")}
//                         </Button>
//                         <Button
//                             isLoading={isLoading}
//                             onClick={handleSubmit(onSubmit)}
//                             disabled={isLoading || !!errors.password || !!errors.confirmPassword}
//                             className="flex-1 btn btn-primary-gradient"
//                         >
//                             {t("confirm")}
//                         </Button>
//                     </ModalFooter>
//                 </ModalContent>
//             </Modal>
//         </>
//     );
// }
