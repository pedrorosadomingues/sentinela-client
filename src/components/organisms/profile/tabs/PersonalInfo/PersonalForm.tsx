import axiosClient from '@/lib/axiosClient';
import { useUserStore } from '@/stores/userStore';
import { Button } from '@nextui-org/react'
import { useState } from 'react'
import { Tabs, Tab } from "@nextui-org/react";
import TabPersonalInfo from './tabs/TabPersonalInfo';
import TabAddressInfo from './tabs/TabAddressInfo';
import TabCompanyInfo from './tabs/TabCompanyInfo';
import { useGlobalStore } from '@/stores/globalStore';
import toast from 'react-hot-toast';
// import { PersonalDataProps } from '@/types/profile';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { formatDateToDDMMYYYY } from '@/utils/date';
import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';

export default function PersonalForm() {
    const t = useTranslations('profile.personal_info.personal_form');

    const personalSchema = z.object({
        personal: z.object({
            name: z.string()
                .optional()
                .refine((value) => !value || /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(value), {
                    message: t('validation.personal.name'),
                }),
            birthdate: z.string()
                .optional()
                .refine((value) =>
                    !value || /^(?:(?:\d{2}[\/\-]\d{2}[\/\-]\d{4})|(?:\d{4}[\/\-]\d{2}[\/\-]\d{2}))$/.test(value),
                    {
                        message: t('validation.personal.birthdate')
                    }),
            document: z.string().optional()
        }),
        address: z.object({
            city: z.string()
                .optional()
                .refine((value) => !value || /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(value), {
                    message: t('validation.address.city')
                }),
            country: z.string()
                .optional()
                .refine((value) => !value || /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(value), {
                    message: t('validation.address.country')
                }),
            postalcode: z.string()
                .optional()
                .refine((value) => !value || /^[A-Za-z0-9\s\-]+$/.test(value), {
                    message: t('validation.address.postalcode')
                }),
            phone: z.string()
                .optional()
                .refine((value) => !value || /^\+?[0-9\s\-\(\)]+$/.test(value), {
                    message: t('validation.address.phone')
                })
        }),
        professional: z.object({
            profession: z.string().optional(),
            other: z.string().optional()
                .refine((value) => !value || /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(value), {
                    message: t('validation.professional.other')
                }),
        }),
    });

    type PersonalDataProps = z.infer<typeof personalSchema>;

    const { isEditMode, setIsEditMode } = useGlobalStore();
    const { getUser } = useUserStore();
    const { user } = useUserStore();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [selected, setSelected] = useState("personal");

    const removeEmptyProps = (obj: any): any => {
        return Object.entries(obj).reduce((acc, [key, value]) => {
            if (value && typeof value === 'object') {
                value = removeEmptyProps(value);
            }

            if (value !== undefined && value !== '') {
                acc[key] = value;
            }

            return acc;
        }, {} as any);
    };

    const initialValues = {
        personal: {
            name: user?.base_name ?? user?.name ?? '',
            birthdate: formatDateToDDMMYYYY(user?.birthday ?? "" as string),
            document: user?.base_document ?? user?.document ?? '',
        },
        address: {
            city: user?.city ?? '',
            country: user?.base_country ?? user?.country ?? '',
            postalcode: user?.postal_code ?? '',
            phone: user?.base_phone ?? user?.phone ?? ''
        },
        professional: {
            profession: user?.profession ?? '',
            other: user?.other_profession ?? ''
        }
    };

    const methods = useForm<PersonalDataProps>({
        defaultValues: initialValues,
        resolver: zodResolver(personalSchema)
    });

    const onSubmitForm: SubmitHandler<PersonalDataProps> = async (data) => {
        setIsSubmitting(true);

        const options = {
            user_uuid: user?.id,
            personal_data: {
                name: data.personal?.name,
                birthday: data.personal?.birthdate,
                document: data.personal?.document,
            },
            profile_image_64: user?.profile_image_64,
            contact_info: {
                phone: data.address?.phone,
                city: data.address?.city,
                postal_code: data.address?.postalcode,
                country: data.address?.country
            },
            professional_data: {
                profession: data.professional?.profession,
                other_profession: data.professional?.other
            }
        };

        const cleanOptions = removeEmptyProps(options);

        return axiosClient.put(`/api/profile/user`, cleanOptions)
            .then(async (res) => {
                if (res.status === 200) {
                    toast.success(t('error.update_success'));
                    await getUser();
                    setIsEditMode(false);
                };
            })
            .catch((err) => {
                if (err.response) {
                    toast.error(t('error.update_failure'));
                } else {
                    toast.error(t('error.server_error'));
                }
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const getErrors = (errorObject: Record<string, any>) => {
        const errorList: string[] = [];

        function extractErrors(errorObj: Record<string, any>) {
            Object.values(errorObj).forEach((error) => {
                if (error?.message) {
                    errorList.push(error.message);
                } else if (typeof error === 'object') {
                    extractErrors(error);
                }
            });
        }

        extractErrors(errorObject);
        return errorList;
    };

    const errorMessages = getErrors(methods.formState.errors);

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={methods.handleSubmit(onSubmitForm)}
                className="w-full flex flex-col gap-4"
            >


                <Tabs
                    aria-label="Options"
                    color="primary"
                    variant="underlined"
                    selectedKey={selected}
                    onSelectionChange={(key) => setSelected(String(key))}
                    classNames={{
                        tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                        cursor: "w-full bg-primary",
                        tab: "max-w-fit px-0 h-12",
                        tabContent: "group-data-[selected=true]:text-primary",
                    }}
                >
                    <Tab
                        key="personal"
                        title={
                            <div className="flex items-center space-x-2">
                                <span>{t('tabs.personal_info')}</span>
                            </div>
                        }
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selected}
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -30, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="w-full"
                            >
                                <TabPersonalInfo
                                    isSubmitting={isSubmitting}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </Tab>
                    <Tab
                        key="contact"
                        title={
                            <div className="flex items-center space-x-2">
                                <span>{t('tabs.contact_info')}</span>
                            </div>
                        }
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selected}
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -30, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="w-full"
                            >
                                <TabAddressInfo
                                    isSubmitting={isSubmitting}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </Tab>
                    <Tab
                        key="professional"
                        title={
                            <div className="flex items-center space-x-2">
                                <span>{t('tabs.professional_info')}</span>
                            </div>
                        }
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selected}
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -30, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="w-full"
                            >
                                <TabCompanyInfo
                                    isSubmitting={isSubmitting}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </Tab>
                </Tabs>


                {
                    isEditMode && (
                        <section className="flex justify-between">
                            <div className="error-list">
                                {errorMessages.length > 0 && (
                                    <ul className="text-danger text-xs list-disc">
                                        {errorMessages.map((message, index) => (
                                            <li key={index}>{message}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="flex items-center gap-2 ml-auto">
                                <Button
                                    size="md"
                                    type='button'
                                    className='btn btn-secondary animate-appearance-in-slow'
                                    onPress={() => {
                                        methods.reset(initialValues);
                                        setIsEditMode(false);
                                    }}
                                    isDisabled={isSubmitting}
                                >
                                    {t('cancel_btn')}
                                </Button>
                                <Button
                                    size="md"
                                    type='submit'
                                    className='btn btn-primary-gradient animate-appearance-in-slow'
                                    isLoading={isSubmitting}
                                    isDisabled={isSubmitting || errorMessages.length > 0}
                                >
                                    {t('save_changes_btn')}
                                </Button>
                            </div>
                        </section>
                    )
                }
            </form >
        </FormProvider >
    )
}
