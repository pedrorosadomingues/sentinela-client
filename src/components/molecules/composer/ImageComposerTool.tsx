/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
"use client";

/* eslint-disable @next/next/no-img-element */
import { Rnd } from "react-rnd";
import { useComposerStore } from "@/stores/composerStore";
import { useFnStore } from "@/stores/fnStore";
import { useEffect, useState } from "react";
import ObjectTools from "../ObjectTools";
import { useMaskStore } from "@/stores/maskStore";

export default function ImageComposerTool() {
  const {
    containerRef,
    images,
    selectedImageId,
    handleFileUpload,
    setSelectedImageId,
    setImageContainerDimensions,
    updateImageRelativePosition,
    updateImageRelativeSize,
    removeAllImages,
  } = useComposerStore();
  const { setActiveMask, setBrushMode, setSelectionMode } = useMaskStore();
  const { initialImage } = useFnStore();
  const [isFocused, setIsFocused] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  const preventDragHandler: React.DragEventHandler<HTMLImageElement> = (event) => {
    event.preventDefault();
  };

  // Função para mover o objeto selecionado com as setas direcionais
  const handleArrowKeyMovement = (event: KeyboardEvent) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
      event.preventDefault(); // Bloqueia o evento padrão da janela (scroll)
    }

    const stepSize = event.shiftKey ? 2 : 1; // Se Shift estiver pressionado, move o dobro (2x)
    const selectedImage = images.find((image) => image.id === selectedImageId);

    if (selectedImage && !selectedImage.isBlocked && !selectedImage.isHidden) {
      let { relativeX, relativeY } = selectedImage.positioning;
      const containerWidth = containerRef.current?.offsetWidth ?? 1;
      const containerHeight = containerRef.current?.offsetHeight ?? 1;

      setIsMoving(true); // Ativa a animação quando o movimento começa

      switch (event.key) {
        case "ArrowUp":
          relativeY = Math.max(0, relativeY - (stepSize / containerHeight) * 100);
          break;
        case "ArrowDown":
          relativeY = Math.min(100, relativeY + (stepSize / containerHeight) * 100);
          break;
        case "ArrowLeft":
          relativeX = Math.max(0, relativeX - (stepSize / containerWidth) * 100);
          break;
        case "ArrowRight":
          relativeX = Math.min(100, relativeX + (stepSize / containerWidth) * 100);
          break;
        default:
          return; // Ignora outras teclas
      }

      // Atualiza a posição relativa do objeto selecionado
      updateImageRelativePosition(selectedImageId!, relativeX, relativeY);

      // Remove a animação após um pequeno intervalo para dar o efeito visual de "movimentação"
      setTimeout(() => setIsMoving(false), 300); // 300ms é o tempo da animação
    }
  };

  // Adiciona o event listener de keydown quando o mouse está sobre o container e há um objeto selecionado
  useEffect(() => {
    const handleMouseEnter = () => setIsFocused(true);
    const handleMouseLeave = () => setIsFocused(false);

    const container = containerRef.current;

    if (container) {
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [containerRef]);

  // Ativa o movimento com as setas direcionais quando o container está em foco
  useEffect(() => {
    if (isFocused && selectedImageId !== null) {
      window.addEventListener("keydown", handleArrowKeyMovement);
    } else {
      window.removeEventListener("keydown", handleArrowKeyMovement);
    }

    return () => {
      window.removeEventListener("keydown", handleArrowKeyMovement);
    };
  }, [isFocused, selectedImageId, images]);

  // Função para redimensionar objetos conforme o container
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const size = containerRef.current.getBoundingClientRect();
        const adjustedWidth = size.width;
        const adjustedHeight = size.height;
        setImageContainerDimensions({ width: adjustedWidth, height: adjustedHeight });
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Para garantir o ajuste inicial

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setImageContainerDimensions]);

  useEffect(() => {
    // resetar o estado de outras funções ao entrar no composer
    setActiveMask(false);
    setBrushMode(false);
    setSelectionMode(false);

    // para remover as imagens ao desmontar o componente ou trocar de ferramenta do redraw
    removeAllImages();
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        id="canvas-area"
        className="flex items-center justify-center overflow-hidden relative"
      >
        {initialImage?.url && (
          <img
            src={initialImage?.url}
            alt="image background"
            crossOrigin="anonymous"
            className="w-full h-full max-h-[600px] object-contain "
            onDragStart={preventDragHandler}
            onClick={() => setSelectedImageId(null)}
          />
        )}

        {images.map((image) => {
          // Cálculo de nova posição e tamanho com base no container em percentuais
          const newWidth = (image.positioning.relativeWidth / 100) * containerRef.current?.offsetWidth!;
          const newHeight = (image.positioning.relativeHeight / 100) * containerRef.current?.offsetHeight!;
          const newX = (image.positioning.relativeX / 100) * containerRef.current?.offsetWidth!;
          const newY = (image.positioning.relativeY / 100) * containerRef.current?.offsetHeight!;

          return (
            <Rnd
              key={image.id}
              size={{ width: newWidth, height: newHeight }}
              position={{ x: newX, y: newY }}
              lockAspectRatio
              onDragStart={() => setIsMoving(true)}
              onClick={() => setSelectedImageId(image.id)}
              onDragStop={(e, d) => {
                const relativeX = (d.x / containerRef.current?.offsetWidth!) * 100;
                const relativeY = (d.y / containerRef.current?.offsetHeight!) * 100;
                // Atualizar a posição relativa apenas se houver mudança real
                if (relativeX !== image.positioning.relativeX || relativeY !== image.positioning.relativeY) {
                  updateImageRelativePosition(image.id, relativeX, relativeY);
                }

                setIsMoving(false); // Desativa a animação quando o movimento termina
              }}
              onResizeStop={(e, direction, ref, delta, position) => {
                const relativeWidth = (parseInt(ref.style.width) / containerRef.current?.offsetWidth!) * 100;
                const relativeHeight = (parseInt(ref.style.height) / containerRef.current?.offsetHeight!) * 100;
                const relativeX = (position.x / containerRef.current?.offsetWidth!) * 100;
                const relativeY = (position.y / containerRef.current?.offsetHeight!) * 100;

                // Atualizar as dimensões e posição relativas apenas se houver mudança real
                if (
                  relativeWidth !== image.positioning.relativeWidth ||
                  relativeHeight !== image.positioning.relativeHeight ||
                  relativeX !== image.positioning.relativeX ||
                  relativeY !== image.positioning.relativeY
                ) {
                  updateImageRelativeSize(image.id, relativeWidth, relativeHeight);
                  updateImageRelativePosition(image.id, relativeX, relativeY);
                }
              }}
              className={`flex flex-col w-full h-full 
                                ${image.isBlocked ? "pointer-events-none" : "pointer-events-auto"}
                                ${image.isHidden
                  ? "hidden pointer-events-none"
                  : isMoving && selectedImageId === image.id
                    ? "border border-vivid-blue-300"
                    : "block group hover:border border-grayscale-200 hover:border-vivid-blue-300"
                }
                                            ${selectedImageId === image.id && "border border-vivid-blue-300"}
                            `}
            >
              <div
                id={`image-${image.id}`}
                className={`group flex items-center justify-center ${image.isHidden ? "hidden" : "block"}`}
              >
                <img
                  src={image.src}
                  alt={`image-${image.id}`}
                  onDragStart={preventDragHandler}
                  crossOrigin="anonymous"
                  style={{
                    transform: `rotate(${image.positioning.rotate}deg)`, // Aplica a rotação ao elemento
                  }}
                />
                <div
                  className={`absolute -top-10 bg-grayscale-200 hover:bg-grayscale-100 transition-all rounded-2xl px-1
                                        ${isMoving && "hidden"} 
                                        ${selectedImageId === image.id ? "flex justify-between  ml-1" : "hidden"}`}
                >
                  <ObjectTools />
                </div>
              </div>
            </Rnd>
          );
        })}
      </div>

      <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
    </>
  );
}
