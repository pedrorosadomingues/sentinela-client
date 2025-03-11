import { Input } from '@/components/shared/ui/Input';
import { useGlobalStore } from '@/stores/globalStore';
import { useTranslations } from 'next-intl';
import { useFormContext } from 'react-hook-form';

export default function TabPersonalInfo({
    isSubmitting,
}: {
    isSubmitting: boolean;
}) {
    const t = useTranslations('profile.personal_info.personal_form.tab_personal_info');
    const { isEditMode } = useGlobalStore();
    const { register, formState: { errors } } = useFormContext<{
        personal: {
            name: string;
            birthdate: string;
            document: string;
        }
    }>();

    return (
        <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-font-lighter">
            <Input
                label={t("name_label")}
                size="sm"
                placeholder={t("name_placeholder")}
                {...register("personal.name")}
                isDisabled={isSubmitting || !isEditMode}
                isInvalid={!!errors.personal?.name}
                errorMessage={errors.personal?.name?.message}
            />
            <Input
                label={t("birthdate_label")}
                size="sm"
                placeholder={t("birthdate_placeholder")}
                {...register("personal.birthdate")}
                isDisabled={isSubmitting || !isEditMode}
                isInvalid={!!errors.personal?.birthdate}
                errorMessage={errors.personal?.birthdate?.message}
            />
            <Input
                label={t("document_label")}
                size="sm"
                placeholder={t("document_placeholder")}
                {...register("personal.document")}
                isDisabled={isSubmitting || !isEditMode}
                isInvalid={!!errors.personal?.document}
                errorMessage={errors.personal?.document?.message}
            />
        </div>
    )
}
