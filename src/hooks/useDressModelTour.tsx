import { useTour } from "@reactour/tour";
import { useUserStore } from "@/stores";
import { useDressModelStore } from "@/stores/dressModelStore";
import { useEffect, useState } from "react";
import { axiosClient } from "@/lib/axios/axiosClient";

// Chave para armazenar no localStorage
const DRESS_MODEL_TOUR_SKIP_KEY = "vq_dress_model_tour_skipped";

/**
 * Hook personalizado para gerenciar o tour do Dress Model
 */
export const useDressModelTour = () => {
  const { setCurrentStep, currentStep, isOpen, setIsOpen } = useTour();
  const { user, getUser } = useUserStore();
  const { handleDressTour, handleExitDressTour } = useDressModelStore();
  const [hasSkippedOnce, setHasSkippedOnce] = useState<boolean>(false);

  /**
   * Verifica se o usuário já pulou o tour uma vez
   */
  useEffect(() => {
    const skippedBefore = localStorage.getItem(DRESS_MODEL_TOUR_SKIP_KEY);
    setHasSkippedOnce(skippedBefore === "true");
  }, []);

  /**
   * Verifica se o usuário já viu o tour do Dress Model
   */
  const hasSeenDressModelTour = (): boolean => {
    const tours = user?.watched_tours.map((tour) => tour.tour_id);
    return tours?.includes(2) ?? false; // 2 é o ID do tour do Dress Model
  };

  /**
   * Inicia o tour do Dress Model
   */
  const startDressModelTour = () => {
    setCurrentStep(0);
    setIsOpen(true);
  };

  /**
   * Encerra o tour do Dress Model
   */
  const closeDressModelTour = () => {
    handleExitDressTour();
    setIsOpen(false);
  };

  /**
   * Função executada antes de fechar o tour
   */
  const beforeCloseTour = () => {
    handleExitDressTour();
  };

  /**
   * Salva no localStorage que o usuário pulou o tour uma vez
   */
  const saveSkipToStorage = () => {
    localStorage.setItem(DRESS_MODEL_TOUR_SKIP_KEY, "true");
    setHasSkippedOnce(true);
  };

  /**
   * Limpa o registro de pulo do tour no localStorage
   */
  const clearSkipFromStorage = () => {
    localStorage.removeItem(DRESS_MODEL_TOUR_SKIP_KEY);
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
      closeDressModelTour();
      
    } catch (error) {
      console.error("Erro ao pular tour:", error);
      // Mesmo em caso de erro, tenta fechar o tour
      closeDressModelTour();
    }
  };

  /**
   * Marca o tour como visualizado no banco de dados
   */
  const markTourAsWatched = async (): Promise<void> => {
    try {
      const body = {
        user_id: user?.id,
        tour_id: 2, // ID do Tour do Dress Model
      };

      setIsOpen(false);
      await axiosClient.post("/user/user_tour", body)
      await getUser(user?.id as number);
    } catch (error) {
      console.error("Erro ao marcar tour como visualizado:", error);
    }
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

  /**
   * Atualiza o estado do Dress Model baseado no passo atual do tour
   */
  useEffect(() => {
    if (isOpen && currentStep >= 0) {
      handleDressTour(currentStep);
    }
  }, [currentStep, isOpen, handleDressTour]);

  return {
    isOpen,
    setIsOpen,
    currentStep,
    setCurrentStep,
    hasSeenDressModelTour,
    hasSkippedOnce,
    startDressModelTour,
    closeDressModelTour,
    beforeCloseTour,
    markTourAsWatched,
    handleSkipTour,
    nextStep,
    prevStep,
  };
}; 