import { getLocaleMessages } from "@/lib/i18n/utils";
import { StepType } from "@reactour/tour";

export interface CustomStepType extends StepType {
    description: string;
    disableButton?: boolean;
    animate?: boolean;
    isLastStep?: boolean;
    delay?: number;
}

export const getWelcomeTourSteps = (locale: string): CustomStepType[] => {
    const messages = getLocaleMessages(locale);

    return [
        {
            selector: ".wt-first-step",
            content: messages.tours.welcome_tour.welcome_title,
            description: messages.tours.welcome_tour.welcome_description,
            animate: true,
            disableActions: true,
        },
        {
            selector: ".wt-second-step",
            content: messages.tours.welcome_tour.functions_list_title,
            description: messages.tours.welcome_tour.functions_list_description,
            animate: true,
            disableActions: true,
        },
        {
            selector: ".wt-third-step",
            content: messages.tours.welcome_tour.select_function_title,
            description: messages.tours.welcome_tour.select_function_description,
            disableButton: true,
        },
    ];
};

export const getDressModelTourSteps = (locale: string): CustomStepType[] => {
    const messages = getLocaleMessages(locale);

    return [
        {
            selector: ".dt-first-step",
            content: messages.tours.dress_tour.welcome_title,
            description: messages.tours.dress_tour.welcome_description,
            animate: true,
            disableActions: true,
        },
        {
            selector: ".dt-second-step",
            content: messages.tours.dress_tour.upload_image_title,
            description: messages.tours.dress_tour.upload_image_description,
            animate: true,
            disableActions: true,
        },
        {
            selector: ".dt-third-step",
            content: messages.tours.dress_tour.image_uploaded_title,
            description: messages.tours.dress_tour.image_uploaded_description,
            animate: true,
            disableActions: true,
        },
        {
            selector: ".dt-fourth-step",
            content: messages.tours.dress_tour.create_or_select_model_title,
            description: messages.tours.dress_tour.create_or_select_model_description,
            animate: true,
            disableActions: true,
        },
        {
            selector: ".dt-fifth-step",
            content: messages.tours.dress_tour.select_existing_model_title,
            description: messages.tours.dress_tour.select_existing_model_description,
            animate: true,
            disableActions: true,
        },
        {
            selector: ".dt-sixth-step",
            content: messages.tours.dress_tour.text_based_model_title,
            description: messages.tours.dress_tour.text_based_model_description,
            animate: true,
            disableActions: true,
        },
        {
            selector: ".dt-seventh-step",
            content: messages.tours.dress_tour.generate_model_title,
            description: messages.tours.dress_tour.generate_model_description,
            animate: true,
            disableActions: true,
        },
        {
            selector: ".dt-eighth-step",
            content: messages.tours.dress_tour.model_details_title,
            description: messages.tours.dress_tour.model_details_description,
            disableActions: true,
        },
        {
            selector: ".dt-ninth-step",
            content: messages.tours.dress_tour.upload_clothing_image_title,
            description: messages.tours.dress_tour.upload_clothing_image_description,
            disableActions: true,
        },
        {
            selector: ".dt-tenth-step",
            content: messages.tours.dress_tour.image_uploaded_title,
            description: messages.tours.dress_tour.image_uploaded_description,
            animate: true,
            disableActions: true,
        },
        {
            selector: ".dt-eleventh-step",
            content: messages.tours.dress_tour.image_type_title,
            description: messages.tours.dress_tour.image_type_description,
            animate: true,
            disableActions: true,
        },
        {
            selector: ".dt-twelfth-step",
            content: messages.tours.dress_tour.select_clothing_category_title,
            description: messages.tours.dress_tour.select_clothing_category_description,
            animate: true,
            disableActions: true,
        },
        {
            selector: ".dt-thirteenth-step",
            content: messages.tours.dress_tour.generate_image_title,
            description: messages.tours.dress_tour.generate_image_description,
            animate: true,
            disableActions: true,
        },
        {
            selector: ".dt-fourteenth-step",
            content: messages.tours.dress_tour.view_result_title,
            description: messages.tours.dress_tour.view_result_description,
            animate: true,
            isLastStep: true,
            disableActions: true,
        },
    ];
};
