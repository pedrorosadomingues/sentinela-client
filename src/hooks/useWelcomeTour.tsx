import { useTour } from "@reactour/tour";
import { useUserStore } from "@/stores";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { axiosClient } from "@/lib/axios/axiosClient";

// Chave para armazenar no localStorage
const WELCOME_TOUR_SKIP_KEY = "vq_welcome_tour_skipped";

/**
 * Hook personalizado para gerenciar o tour de boas-vindas
 */
export const useWelcomeTour = () => {
  const { setCurrentStep, currentStep, isOpen, setIsOpen } = useTour();
  const { user, getUser } = useUserStore();
  const router = useRouter();
  const [hasSkippedOnce, setHasSkippedOnce] = useState<boolean>(false);

  /**
   * Verifica se o usuário já pulou o tour uma vez
   */
  useEffect(() => {
    const skippedBefore = localStorage.getItem(WELCOME_TOUR_SKIP_KEY);
    setHasSkippedOnce(skippedBefore === "true");
  }, []);

  /**
   * Verifica se o usuário já viu o tour de boas-vindas
   */
  const hasSeenWelcomeTour = (): boolean => {
    const tours = user?.watched_tours.map((tour) => tour.tour_id);
    return tours?.includes(1) ?? false;
  };

  /**
   * Inicia o tour de boas-vindas
   */
  const startWelcomeTour = () => {
    setCurrentStep(0);
    setIsOpen(true);
  };

  /**
   * Encerra o tour de boas-vindas
   */
  const closeWelcomeTour = () => {
    setIsOpen(false);
  };

  /**
   * Salva no localStorage que o usuário pulou o tour uma vez
   */
  const saveSkipToStorage = () => {
    localStorage.setItem(WELCOME_TOUR_SKIP_KEY, "true");
    setHasSkippedOnce(true);
  };

  /**
   * Limpa o registro de pulo do tour no localStorage
   */
  const clearSkipFromStorage = () => {
    localStorage.removeItem(WELCOME_TOUR_SKIP_KEY);
    setHasSkippedOnce(false);
  };

  /**
   * Gerencia o comportamento quando o usuário pula o tour
   * Na primeira vez, apenas salva no localStorage
   * Na segunda vez, marca o tour como concluído
   */
  const handleSkipTour = async (): Promise<void> => {
    try {
      if (hasSkippedOnce) {
        // Se já pulou antes, marca como concluído
        await markTourAsWatched();
        clearSkipFromStorage(); // Limpa o storage já que não precisamos mais dessa informação
      } else {
        // Primeira vez pulando, salva no storage
        saveSkipToStorage();
      }
      
      // Garante que o tour seja fechado
      closeWelcomeTour();
      
    } catch (error) {
      console.error("Erro ao pular tour:", error);
      // Mesmo em caso de erro, tenta fechar o tour
      closeWelcomeTour();
    }
  };

  /**
   * Marca o tour como visualizado no banco de dados
   */
  const markTourAsWatched = async (): Promise<void> => {
    try {
      const body = {
        user_id: user?.id,
        tour_id: 1, // ID do Tour de Boas-vindas
      };

      setIsOpen(false);
      await axiosClient.post("/user/user_tour", body)
      await getUser(user?.id as number);
    } catch (error) {
      console.error("Erro ao marcar tour como visualizado:", error);
    }
  };

  /**
   * Avança para o próximo passo do tour e redireciona para a página do Dress Model, se necessário
   */
  const goToDressModelStep = async (): Promise<void> => {
    await markTourAsWatched();

    if (currentStep === 0) {
      setCurrentStep(currentStep + 1);
    }

    router.push(`/main/fns/dress-model`);
  };

  /**
   * Avança para o próximo passo do tour
   */
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  /**
   * Volta para o passo anterior do tour
   */
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return {
    isOpen,
    setIsOpen,
    currentStep,
    hasSeenWelcomeTour,
    hasSkippedOnce,
    startWelcomeTour,
    closeWelcomeTour,
    markTourAsWatched,
    goToDressModelStep,
    handleSkipTour,
    nextStep,
    prevStep,
  };
}; 