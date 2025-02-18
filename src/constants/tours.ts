import { StepType } from "@reactour/tour";

export interface CustomStepType extends StepType {
    description: string;
    disableButton?: boolean;
    animate?: boolean;
    isLastStep?: boolean;
    delay?: number;
}

export const WELCOME_TOUR_STEPS: CustomStepType[] = [
    {
        selector: ".welcome-tour-first-step",
        content: "Bem-vindo!",
        description: "Este é o tour de boas-vindas da Vestiq. Vamos te mostrar como é fácil criar looks personalizados com a nossa plataforma.",
        animate: true,
        disableActions: true,
    },
    {
        selector: ".welcome-tour-second-step",
        content: "Lista de funções",
        description: "Esta é a lista de funções disponíveis na Vestiq.",
        animate: true,
        disableActions: true,
    },
    {
        selector: ".welcome-tour-third-step",
        content: "Selecione uma função",
        description: "Para começar, clique em 'Começar' na opção Vestir Modelo e veja como é fácil criar looks personalizados.",
        disableButton: true,
    },
];

export const DRESS_MODEL_TOUR_STEPS: CustomStepType[] = [
    {
        selector: ".dt-first-step",
        content: "Bem-vindo!",
        description:
            "Para começar, clique em 'Começar' na opção Vestir Modelo e veja como é fácil criar looks personalizados.",
        animate: true,
        disableActions: true,
    },
    {
        selector: ".dt-second-step",
        content: "Envie uma imagem",
        description: "Para começar a criar suas imagens incríveis com a Vestiq, o primeiro passo é adicionar a imagem do modelo. Clique no espaço em branco para escolher uma imagem do seu dispositivo.",
        animate: true,
        disableActions: true,
    },
    {
        selector: ".dt-third-step",
        content: "Imagem enviada",
        description: "Sua imagem foi enviada com sucesso!",
        animate: true,
        disableActions: true,
    },
    {
        selector: ".dt-fourth-step",
        content: "Crie ou selecione um modelo pronto",
        description:
            "Você também pode selecionar ou criar um Modelo.",
        animate: true,
        disableActions: true,
    },
    {
        selector: ".dt-fifth-step",
        content: "Selecionar modelo Pronto",
        description:
            "Escolha um modelo pré-existente da galeria da Vestiq ou escolha um criado por você anteriormente. Perfeito para quem quer praticidade e agilidade sem precisar enviar uma imagem.",
        animate: true,
        disableActions: true,
    },
    {
        selector: ".dt-sixth-step",
        content: "Modelo por texto",
        description: "Descreva o modelo que deseja criar usando apenas texto. Exemplo: “Mulher com cabelo curto, pele clara, usando expressão neutra.”",
        animate: true,
        disableActions: true,
    },
    {
        selector: ".dt-seventh-step",
        content: "Gerar Modelo",
        description:
            "Aqui você pode personalizar cada detalhe do seu modelo, escolhendo características. É uma forma interativa de criar o modelo, combinando diferentes elementos para um resultado exclusivo.",
        animate: true,
        disableActions: true,
    },
    {
        selector: ".dt-eighth-step",
        content: "Detalhes do modelo",
        description: "Ajuste pequenos detalhes para um resultado com sua preferência. Clique na seta para expandir as opções:",
        disableActions: true,
    },
    {
        selector: ".dt-ninth-step",
        content: "Adicione a Imagem da Roupa",
        description:
            "Agora, envie a imagem da peça ou do modelo com a peça que deseja vestir no modelo do passo anterior.",
        disableActions: true,
    },
    {
        selector: ".dt-tenth-step",
        content: "Imagem enviada",
        description: "Sua imagem foi enviada com sucesso!",
        animate: true,
        disableActions: true,
    },
    {
        selector: ".dt-eleventh-step",
        content: "Tipo de imagem",
        description: "Apenas a roupa – Usa a peça sem um modelo por trás. Modelo – Peça presente em um modelo.",
        animate: true,
        disableActions: true,
    },
    {
        selector: ".dt-twelfth-step",
        content: "Escolha a categoria da peça",
        description: `Agora, selecione qual parte da roupa será aplicada ao modelo.
Parte Superior – Roupa ajustada à região do tronco e braços.
Parte Inferior – Peça aplicada na região da cintura para baixo.
Corpo Inteiro – Vestimenta que cobre todo o corpo do modelo.`,
        animate: true,
        disableActions: true,
    },
    {
        selector: ".dt-thirteenth-step",
        content: "Vamos gerar sua imagem",
        description: "Clique em 'Gerar Imagem' para que a IA aplique a peça escolhida no modelo de forma realista.",
        animate: true,
        delay: 2000,
        disableActions: true,
    },
    {
        selector: ".dt-fourteenth-step",
        content: "Agora é hora de ver o resultado",
        description: `Sua imagem será exibida assim que o processo for concluído.`,
        animate: true,
        isLastStep: true,
        disableActions: true,
    },
];
