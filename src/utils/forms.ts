import OptionProps from "@/interfaces/OptionProps";

export function findValueByTitle(arr: OptionProps[], title: string) {
    const foundItem = arr.find(item => item.title === title);

    return foundItem ? foundItem.value as string : title;
};

export const MAX_SUGGESTION_CHAR_COUNT = 240;
