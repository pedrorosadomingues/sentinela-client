/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { useComposerStore } from '@/stores/composerStore';
import { DriveFileRenameOutlineOutlined, DeleteOutlined, VerticalAlignCenterOutlined, VisibilityOutlined, LockOutlined, ContentCopyOutlined, MoreHorizOutlined, UpdateDisabledOutlined, RotateLeftOutlined, RotateRightOutlined } from '@mui/icons-material';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { Button } from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import React from 'react';

export default function ObjectTools() {
    const t = useTranslations('tools.image_composer')
    const {
        images,
        selectedImageId,
        removeImage,
        duplicateObject,
        toggleImageVisibility,
        toggleBlockImageMovement,
        updateImageRotation,
        showRenameModal
    } = useComposerStore();

    const items = [
        { key: 'rename', label: t('dropdown.rename'), icon: <DriveFileRenameOutlineOutlined fontSize='small' /> },
        { key: 'hide', label: t('dropdown.hide'), icon: <VisibilityOutlined fontSize='small' /> },
        { key: 'centralize', label: t('dropdown.centralize'), icon: <VerticalAlignCenterOutlined fontSize='small' /> },
        { key: 'reset-rotation', label: t('dropdown.reset_rotation'), icon: <UpdateDisabledOutlined fontSize='small' /> },
        { key: 'duplicate', label: t('dropdown.duplicate'), icon: <ContentCopyOutlined fontSize='small' /> },
        { key: 'block', label: t('dropdown.block'), icon: <LockOutlined fontSize='small' /> },
        { key: 'delete', label: t('dropdown.delete'), icon: <DeleteOutlined fontSize='small' /> },
    ];

    const handleRotate = (direction: 'left' | 'right' | 'original') => {
        if (selectedImageId) {
            updateImageRotation(selectedImageId, direction);
        }
    };

    const handleAction = (key: string) => {
        if (!selectedImageId) return;

        switch (key) {
            case 'rename':
                showRenameModal();
                break;
            case 'hide':
                toggleImageVisibility(selectedImageId);
                break;
            case 'reset-rotation':
                handleRotate('original');
                break;
            case 'duplicate':
                duplicateObject(selectedImageId);
                break;
            case 'block':
                toggleBlockImageMovement(selectedImageId);
                break;
            case 'delete':
                removeImage(selectedImageId);
                break;
            default:
                break;
        }
    };

    const dropdownContent = () => (
        items.map((item) => {
            if (item.key === 'reset-rotation') {
                const selectedImageRotation = images.find(image => image.id === selectedImageId)?.positioning.rotate;

                return (
                    selectedImageRotation !== 0 && (
                        <DropdownItem key={item.key} endContent={item.icon}>
                            {item.label}
                        </DropdownItem>
                    )
                );
            }
            return (
                <DropdownItem key={item.key} endContent={item.icon}>
                    {item.label}
                </DropdownItem>
            );
        })
    );

    return (
        <>
            <Button
                onPress={() => handleRotate('left')}
                size='sm'
                variant="light"
                radius='full'

                isIconOnly
                startContent={<RotateLeftOutlined />}
            />
            <Button
                onPress={() => handleRotate('right')}
                size='sm'
                variant="light"
                radius='full'

                isIconOnly
                startContent={<RotateRightOutlined />}
            />

            <Button
                onPress={() => duplicateObject(selectedImageId!)}
                size='sm'
                variant="light"
                radius='full'

                isIconOnly
                startContent={<ContentCopyOutlined fontSize='small' />}
            />
            <Button
                onPress={() => removeImage(selectedImageId!)}
                size='sm'
                variant="light"
                radius='full'

                isIconOnly
                startContent={<DeleteOutlined />}
            />
            <Dropdown placement="bottom-start">
                <DropdownTrigger>
                    <Button
                        size="sm"
                        variant="light"
                        radius="full"
                        isIconOnly
                        startContent={<MoreHorizOutlined />}
                    />
                </DropdownTrigger>
                <DropdownMenu
                    aria-label="Ações de objeto"
                    onAction={(key) => handleAction(key as string)}
                >
                    {dropdownContent() as any}
                </DropdownMenu>
            </Dropdown>
        </>
    );
}
