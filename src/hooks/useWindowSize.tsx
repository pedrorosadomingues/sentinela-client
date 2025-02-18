import { useState, useEffect } from "react";

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    // Função que atualiza o estado quando a janela for redimensionada
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Adiciona o listener no evento de resize
    window.addEventListener("resize", handleResize);

    // Executa a função uma vez para capturar o tamanho inicial
    handleResize();

    // Remove o listener ao desmontar o componente
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowSize;
}
