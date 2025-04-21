import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Input,
} from "@nextui-org/react";
import { useComposerStore } from "@/stores/composerStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { useEffect } from "react";

export default function RenameObject() {
    const t = useTranslations("tools.image_composer");
    const { renameModal, showRenameModal, updateImageName, selectedImageId } = useComposerStore();
    const objectNameSchema = z.object({
        objectName: z.string(),
    }).refine((data) => data.objectName.trim().length > 0, {
        message: t('rename.error.object_name_required'),
        path: ['objectName']
    }).refine((data) => data.objectName.trim().length >= 3, {
        message: t('rename.error.object_name_error_min'),
        path: ['objectName']
    }).refine((data) => data.objectName.trim().length <= 15, {
        message: t('rename.error.object_name_error_max'),
        path: ['objectName']
    }).refine((data) => /^[a-zA-Z0-9\s]+$/.test(data.objectName), {
        message: t('rename.error.object_name_error_special'),
        path: ['objectName']
    });

    type FormInput = z.infer<typeof objectNameSchema>;

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormInput>({
        defaultValues: {
            objectName: ''
        },
        resolver: zodResolver(objectNameSchema),
    });

    useEffect(() => {
        if (selectedImageId) {
            reset({ objectName: '' });
        };
    }, [renameModal]);

    if (!renameModal) return null;

    const handleRenameObject = (data: FormInput) => {
        if(!selectedImageId) return;

        updateImageName(selectedImageId, data.objectName);
        showRenameModal();
    };

    return (
        <Modal
            as="form"
            onSubmit={handleSubmit(handleRenameObject)}
            backdrop="opaque"
            placement="center"
            isOpen={renameModal}
            onOpenChange={showRenameModal}
            size="md"
        >
            <ModalContent>
                <ModalHeader className="flex items-center justify-center">
                    <h1 className="text-xl text-center font-semibold">
                        {t("rename.title")}
                    </h1>
                </ModalHeader>
                <ModalBody>
                    <div>
                        <Input
                            label={t("rename.label")}
                            variant="bordered"
                            labelPlacement="outside"
                            placeholder={t("rename.placeholder")}
                            id="new-folder-input"
                            {...register("objectName")}
                            isInvalid={!!errors.objectName}
                        />
                        {errors.objectName && <p className="text-danger text-xs">{errors.objectName.message}</p>}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="bordered"
                        className="flex-1 btn btn-secondary"
                        onPress={showRenameModal}
                    >
                        Cancelar
                    </Button>
                    <Button
                        isDisabled={!!errors.objectName}
                        color="primary" type="submit" className="flex-1 btn btn-primary-gradient">
                        Confirmar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

