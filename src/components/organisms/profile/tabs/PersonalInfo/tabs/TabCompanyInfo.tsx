// import { Input } from '@/components/shared/ui/Input';
// import Select from '@/components/shared/ui/Select';
// import { useGlobalStore } from '@/stores/globalStore';
// import { useUserStore } from '@/stores/userStore';
// import { useTranslations } from 'next-intl';
// import { useEffect } from 'react';
// import { useFormContext } from 'react-hook-form';

// export default function TabCompanyInfo({
//     isSubmitting,
// }: {
//     isSubmitting: boolean;
// }) {
//     const t = useTranslations('profile.personal_info.personal_form.tab_company_info');
//     const { isEditMode } = useGlobalStore();
//     const { user } = useUserStore();
//     const { watch, register, unregister, formState: { errors } } = useFormContext<{
//         professional: {
//             profession: string;
//             other: string;
//         }
//     }>();
//     const [profession] = watch(['professional.profession']);

//     useEffect(() => {
//         if (profession !== 'other') {
//             unregister('professional.other');
//         }
//     }, [profession]);

//     const professions = [
//         { value: "architect", title: t("professions.architect") },
//         { value: "engineer", title: t("professions.engineer") },
//         { value: "interior_designer", title: t("professions.interior_designer") },
//         { value: "planner", title: t("professions.planner") },
//         { value: "real_estate_agent", title: t("professions.real_estate_agent") },
//         { value: "student", title: t("professions.student") },
//         { value: "teacher", title: t("professions.teacher") },
//         { value: "other", title: t("professions.other") }
//     ];

//     return (
//         <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-4 text-font-lighter">
//             <Select
//                 placeholder={t("profession_placeholder")}
//                 label={t("profession_label")}
//                 labelPlacement='outside'
//                 variant="bordered"
//                 isDisabled={isSubmitting || !isEditMode}
//                 {...register('professional.profession')}
//                 aria-label="Profession"
//                 radius="sm"
//                 classNames={{
//                     mainWrapper: `${isSubmitting || !isEditMode ? 'bg-gray rounded-xl text-grayscale-600' : 'bg-white text-font'}`,
//                     innerWrapper: "placeholder:text-grayscale-900"
//                 }}
//                 defaultSelectedKeys={[user?.profession ?? ""]}
//                 disallowEmptySelection
//                 options={professions}
//             />
//             {profession === "other" && (
//                 <Input
//                     size="sm"
//                     label={t("other_profession_label")}
//                     placeholder={t("other_profession_placeholder")}
//                     {...register("professional.other")}
//                     isDisabled={isSubmitting || !isEditMode}
//                     isInvalid={!!errors.professional?.other}
//                     errorMessage={errors.professional?.other?.message}
//                 />
//             )}
//         </div>
//     )
// }
