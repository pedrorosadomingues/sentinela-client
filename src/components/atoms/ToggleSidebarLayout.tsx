import { useSidebarStore } from '@/zustand-stores';
import { KeyboardDoubleArrowLeft, KeyboardDoubleArrowRight } from '@mui/icons-material';
import { Button } from '@nextui-org/react';
import React, { useEffect } from 'react';

export default function ToggleSidebarLayout() {
    const { sidebarLayout, setSidebarLayout, toggleSidebarLayout } = useSidebarStore();

    // Hook para verificar o tamanho da janela e ajustar o layout da sidebar
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768 && sidebarLayout !== "expanded") {
                setSidebarLayout("expanded");
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        // Cleanup ao desmontar o componente
        return () => window.removeEventListener("resize", handleResize);
    }, [sidebarLayout, setSidebarLayout]);

    return (
        <div className={`h-20 w-full hidden md:flex justify-center items-end bg-gradient-to-t from-white to-white/20`}>
            <div className="bg-white h-12 w-full flex justify-center">
                {sidebarLayout === "expanded" ? (
                    <Button isIconOnly variant="light" size='sm' className="rounded-full mb-2 text-font-lighter" onClick={toggleSidebarLayout}>
                        <KeyboardDoubleArrowLeft fontSize='small' />
                    </Button>
                ) : (
                    <Button isIconOnly variant="light" size='sm' className="rounded-full mb-2 text-font-lighter" onClick={toggleSidebarLayout}>
                        <KeyboardDoubleArrowRight fontSize='small' />
                    </Button>
                )}
            </div>
        </div>
    );
}
