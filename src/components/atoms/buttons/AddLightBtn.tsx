/* eslint-disable @next/next/no-img-element */
import { LightOutlined } from '@mui/icons-material'
import { Button, Popover, PopoverContent, PopoverTrigger, Tooltip } from '@nextui-org/react'
import { useComposerStore } from '@/stores/composerStore';
import { Key } from 'react';
import { useTranslations } from 'next-intl';

export default function AddLightBtn() {
    const t = useTranslations('tools.image_composer')
    const { addIESLight } = useComposerStore();

    const lightTypes = [
        { key: 'point', src: '/images/light/spot-light-1.png', name: 'Point Light', type: 'ies' },
        { key: 'spot', src: '/images/light/spot-light-2.png', name: 'Spot Light', type: 'ies' },
        { key: 'directional', src: '/images/light/spot-light-3.png', name: 'Directional Light', type: 'ies' },
        { key: 'area', src: '/images/light/spot-light-4.png', name: 'Area Light', type: 'ies' },
    ];

    return (
        <Popover
            placement="bottom-end"
            backdrop={'opaque'}
        >
            <PopoverTrigger>
                <Button
                    variant='bordered'
                    size='sm'
                    className={`btn`}
                    startContent={
                        <Tooltip content={t('btns.lights')} className='mt-2' color='foreground' placement='bottom'>
                            <LightOutlined fontSize='small' />
                        </Tooltip>
                    }
                    isIconOnly
                />
            </PopoverTrigger>
            <PopoverContent className='gap-2 p-2'>
                <h3 className="text-sm">IES Lights</h3>

                <ul className='grid grid-cols-4 gap-2 justify-between'>
                    {lightTypes.map((light: { key: Key | null | undefined; src: string | undefined; name: string | undefined; }) => (
                        <li
                            key={light.key}
                            className={`w-32 h-32 bg-black hover:bg-black/90 rounded-md relative animate-appearance-in-slow flex flex-col items-center justify-between border py-1 px-2 cursor-pointer`}
                            onClick={() => addIESLight(light.src as string)}
                        >
                            <img
                                src={light.src}
                                alt={light.name}
                                className='w-full h-full object-contain' />
                        </li>
                    ))}
                </ul>
            </PopoverContent>
        </Popover>
    )
}
