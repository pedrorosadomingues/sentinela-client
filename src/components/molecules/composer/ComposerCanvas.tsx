/* eslint-disable @next/next/no-img-element */
import { useComposerStore } from '@/stores/composerStore';
import { DriveFileRenameOutlineOutlined, MoreVertOutlined, DeleteOutlined, VerticalAlignCenterOutlined, VisibilityOutlined, LockOutlined, LockOpenOutlined, ContentCopyOutlined, UpdateDisabledOutlined } from '@mui/icons-material';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { Button, Tooltip } from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import React from 'react'

export default function ComposerCanvas({
    onCentralize,
}: {
    onCentralize: () => void
}) {
    const t = useTranslations('tools.image_composer')
    const { images, composerMode, selectedImageId, setSelectedImageId, removeImage, showRenameModal, updateImageName, updateImageRotation, duplicateObject, toggleImageVisibility, toggleBlockImageMovement } = useComposerStore();

    const handleRenameObject = (id: number) => {
        const newName = prompt('Digite o novo nome do objeto');

        if (newName) {
            updateImageName(id, newName);
        };
    };

    const handleRotate = (direction: 'left' | 'right' | 'original') => {
        if (selectedImageId) {
            updateImageRotation(selectedImageId, direction);
        }
    };

    const items = [
        { key: 'rename', label: t('dropdown.rename'), icon: <DriveFileRenameOutlineOutlined fontSize='small' /> },
        { key: 'hide', label: t('dropdown.hide'), icon: <VisibilityOutlined fontSize='small' /> },
        { key: 'centralize', label: t('dropdown.centralize'), icon: <VerticalAlignCenterOutlined fontSize='small' /> },
        { key: 'reset-rotation', label: t('dropdown.reset_rotation'), icon: <UpdateDisabledOutlined fontSize='small' /> },
        { key: 'duplicate', label: t('dropdown.duplicate'), icon: <ContentCopyOutlined fontSize='small' /> },
        { key: 'block', label: t('dropdown.block'), icon: <LockOutlined fontSize='small' /> },
        { key: 'delete', label: t('dropdown.delete'), icon: <DeleteOutlined fontSize='small' /> },
    ];

    const handleAction = (key: string) => {
        switch (key) {
            case 'rename':
                showRenameModal();
                break;
            case 'hide':
                toggleImageVisibility(selectedImageId!);
                break;
            case 'reset-rotation':
                handleRotate('original');
                break;
            case 'centralize':
                onCentralize();
                break;
            case 'duplicate':
                duplicateObject(selectedImageId!);
                break;
            case 'block':
                toggleBlockImageMovement(selectedImageId!);
                break;
            case 'delete':
                removeImage(selectedImageId!);
                break;
            default:
                break;
        };
    };

    return (
        <>
            {composerMode && images.length > 0 && (
                <section className='flex flex-col'>
                    <ul className="flex my-2 gap-2">
                        {images.map((image) => (
                            <li
                                key={image.id}
                                className={`w-24 h-24 rounded-md relative animate-appearance-in-slow
                            flex flex-col items-center justify-between border py-1 px-2
                            cursor-pointer
                            ${selectedImageId === image.id ? 'bg-vivid-blue-300 hover:bg-vivid-blue-400 text-white'
                                        : 'hover:bg-vivid-blue-100'}
                            `}
                                onClick={() => setSelectedImageId(image.id)}
                            >
                                <Button
                                    size="sm"
                                    variant='light'
                                    radius='full'
                                    isIconOnly
                                    onPress={() => toggleBlockImageMovement(image.id)}
                                    className="-left-1 -top-1 absolute scale-85"
                                    startContent={
                                        !image.isBlocked ?
                                            <Tooltip content={t('btns.block')} color='foreground' placement='top'>
                                                <LockOpenOutlined className={selectedImageId === image.id ? 'text-white/50' : 'text-font-lighter'} fontSize='small' />
                                            </Tooltip>
                                            :
                                            <Tooltip content={t('btns.unlock')} color='foreground' placement='top'>
                                                <LockOutlined className={selectedImageId === image.id ? 'text-white' : 'text-font'} fontSize='small' />
                                            </Tooltip>
                                    }
                                />
                                <Dropdown placement='bottom-start'>
                                    <DropdownTrigger onClick={() => setSelectedImageId(image.id)}>
                                        <Button
                                            size="sm"
                                            variant='light'
                                            radius='full'
                                            isIconOnly
                                            className="-right-1 -top-1 absolute scale-85"
                                            startContent={
                                                <MoreVertOutlined className={selectedImageId === image.id ? 'text-white' : 'text-font'} fontSize='small' />
                                            }
                                        />
                                    </DropdownTrigger>
                                    <DropdownMenu
                                        aria-label="embed image Actions"
                                        items={items}
                                        onAction={(key) => handleAction(key as string)}
                                    >
                                        {(item) => (
                                            <DropdownItem
                                                key={item.key}
                                                color={item.key === "delete" ? "danger" : "default"}
                                                className={item.key === "delete" ? "text-danger" : ""}
                                                endContent={item.icon}
                                            >
                                                {item.label}
                                            </DropdownItem>
                                        )}
                                    </DropdownMenu>
                                </Dropdown>
                                <img src={image.src} alt={image.name} className='w-16 h-16 object-contain' />
                                <Tooltip key={image.id} content={image.name} color='foreground' placement='bottom-start'>
                                    <span
                                        className='whitespace-nowrap overflow-hidden text-ellipsis text-sm max-w-full px-1'
                                        onDoubleClick={() => handleRenameObject(image.id)}
                                    >
                                        {image.name}
                                    </span>
                                </Tooltip>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </>
    )
}
