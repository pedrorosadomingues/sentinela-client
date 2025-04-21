/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormTextInputProps } from "@/types/generate-form";
import { Close, RemoveCircle } from "@mui/icons-material";
import { Input } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { forwardRef, useEffect, useRef, useState } from "react";
import ToolInfo from "@/components/organisms/ui/ToolInfo";
import { MAX_SUGGESTION_CHAR_COUNT } from "@/utils/forms";

interface SuggestionInputProps extends FormTextInputProps {
  setValue: any;
}

const SuggestionInput = forwardRef<HTMLInputElement, SuggestionInputProps>(
  ({ setValue, name, ...rest }, ref) => {
    const t = useTranslations("functions.inputs");
    const tInfo = useTranslations("tool-info");
    const [tags, setTags] = useState<string[]>([]);
    const [text, setText] = useState("");
    const [charCount, setCharCount] = useState(0);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleContainerClick = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    useEffect(() => {
      setValue(name as string, tags);
    }, [tags, setValue, name]);

    useEffect(() => {
      const combinedText = tags.join(" ") + text;
      // Remove vírgulas e quebras de linha para a contagem
      const sanitizedText = combinedText.replace(/[,|\r\n]+/g, "");

      setCharCount(sanitizedText.length);
    }, [tags, text]);

    const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();

      const pastedText = e.clipboardData.getData("text");
      const singleLineText = pastedText.replace(/[\r\n]+/g, " ").trim();
      const parts = singleLineText.split(",");
      const newTags = parts
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");

      setTags((prev) => [...prev, ...newTags]);
      setText("");
    };

    const onChange = (value: string) => {
      // Remove quebras de linha em tempo real, mas não remove espaços internos
      const sanitizedValue = value.replace(/[\r\n]+/g, " ");
      setText(sanitizedValue);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "," || e.key === "Enter") {
        e.preventDefault();

        // Remove espaços adicionais do início e do fim antes de adicionar como tag
        const trimmedText = text.trim();

        if (trimmedText) {
          setTags((prev) => [...prev, trimmedText]);

          setText("");
        }
      }
    };

    const onRemoveTag = (index: number) => {
      setTags((prev) => prev.filter((_, i) => i !== index));
    };

    const onClearAll = () => {
      setTags([]);
    };

    const handleBlur = () => {
      const trimmedText = text.trim();

      if (trimmedText) {
        setTags((prev) => [...prev, trimmedText]);
        setText("");
      }
    };

    return (
      <div className="flex flex-col items-start gap-2 w-full">
        <div className="flex flex-col items-start gap-1">
          <label htmlFor="suggestions" className="text-sm flex gap-1">
            {t("suggestion_label")}
            <ToolInfo
              title={tInfo("suggestion.title")}
              text={tInfo("suggestion.text")}
              video="https://redrawacademy.s3.sa-east-1.amazonaws.com/videos/tutorial/suggestions.mp4"
              href="https://academy.arch.redraw.pro/"
            />
          </label>
          <span className="text-xs text-font-lighter">
            {t("suggestion_tip_label")}
          </span>
        </div>
        <div
          id="suggestion-input-area"
          className="tag-container cursor-text w-full relative rounded-xl border-2 shadow-sm h-[120px] overflow-y-auto scrollbar
        hover:border-2 hover:border-grayscale-300 ease-in-out transition-all duration-300"
          onClick={handleContainerClick}
        >
          <ul className="flex flex-wrap gap-2 p-1 w-full">
            {tags.map((item, index) => (
              <li
                key={index}
                className="flex items-center gap-1 group bg-grayscale-100 animate-appearance-in px-2 py-1 rounded-xl max-w-full"
              >
                <p className="text-xs whitespace-pre-wrap break-words max-w-full overflow-hidden">
                  {item}
                </p>
                <span
                  className="cursor-pointer"
                  onClick={() => onRemoveTag(index)}
                >
                  <Close
                    fontSize="small"
                    className="text-grayscale-300 group-hover:text-gray-700 text-xs"
                  />
                </span>
              </li>
            ))}
          </ul>
          <Input
            ref={inputRef}
            id="suggestion-input"
            name="suggestion"
            placeholder={tags.length > 0 ? "" : t("suggestion_placeholder")}
            fullWidth
            className="w-full"
            variant="bordered"
            classNames={RESET_STYLE}
            labelPlacement="outside"
            onChange={(e) => onChange(e.target.value)}
            value={text}
            onKeyDown={onKeyDown}
            onPaste={onPaste}
            onBlur={handleBlur}
          />
        </div>
        <div className="w-full flex items-center justify-between">
          <span
            className={`text-xs ${
              charCount > MAX_SUGGESTION_CHAR_COUNT
                ? "text-danger"
                : "text-font-lighter"
            }`}
          >
            {charCount}/{MAX_SUGGESTION_CHAR_COUNT}
          </span>
          {tags.length > 3 && (
            <span
              className="cursor-pointer text-danger text-xs ml-auto"
              onClick={onClearAll}
            >
              {t("suggestion_remove_all")}
              <RemoveCircle className="ml-1 text-sm" fontSize="small" />
            </span>
          )}
        </div>

        <input
          {...{ ...rest, size: undefined }}
          type="hidden"
          value={tags.join(",")}
        />
      </div>
    );
  }
);

SuggestionInput.displayName = "SuggestionInput";

export default SuggestionInput;

const RESET_STYLE = {
  input: "border-none bg-transparent shadow-none stroke-none",
  mainWrapper: "border-none bg-transparent shadow-none stroke-none",
  base: "border-none bg-transparent shadow-none stroke-none",
  innerWrapper: "border-none bg-transparent shadow-none stroke-none",
  inputWrapper: "border-none bg-transparent shadow-none stroke-none p-2 m-0",
};
