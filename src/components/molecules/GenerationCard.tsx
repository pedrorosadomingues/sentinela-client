/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

//import { useDisclosure } from "@nextui-org/react";
import { useGenerationStore, useGlobalStore } from "@/zustand-stores";
import { useTranslations } from "next-intl";
import { Generation } from "@/interfaces/generation";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import ConfirmationModal from "@/components/organisms/ConfirmationModal";

export default function GenerationCard({ data }: { data: Generation }) {
  const [isHidden, setIsHidden] = useState(true);
  const t = useTranslations("view-image-modal");
  //   const st = useTranslations("layout.sidebar");

  const {
    generations,
    setGenerations,
    setSelectedGenerations,
    selectedGenerations,
  } = useGenerationStore();
  const { openConfirmation, closeConfirmation } = useGlobalStore();

  //   const { isOpen, onOpen, onOpenChange } = useDisclosure();

  //   function handleCheck() {
  //     const index = generations.findIndex((item: any) => item.id === data.id);
  //     if (index !== -1) {
  //       const selectedGenerations = [...generations];

  //       selectedGenerations[index] = {
  //         ...selectedGenerations[index],
  //         checked: !selectedGenerations[index].checked,
  //       };

  //       setGenerations(selectedGenerations);

  //       const selectedGenerationIds = selectedGenerations
  //         .filter((item) => item.checked)
  //         .map((item) => item.id);

  //       setSelectedGenerations(selectedGenerationIds);
  //     }
  //   }

  const handleDelete = async () => {
    openConfirmation(
      t("confirmation"),
      t("deleteImageConfirmation"),
      async () => {
        // setIsLoading(true);
        alert("delete");
        try {
          //   const body = {
          //     email: user?.email,
          //     generations_ids: [id],
          //   };
          //   deleteGenerations(body, user?.email as string);
          //   toast.use("success", t("imagesDeletedSuccess"));

          closeConfirmation();
        } catch (error) {
          alert(error);
          // toast.use("error", t("imagesDeletedError"));
          //  setIsLoading(false);
        } finally {
          //   await getProjectById(selectedProjectId as unknown as number);
          //   setIsLoading(false);
          //   onOpenChange ? onOpenChange(false) : null;
        }
      },

      () => {
        closeConfirmation();
      },
      "danger"
    );
  };

  //   const handleOpen = () => {
  //     // setselectedGenerations([data.id]);

  //     onOpen();
  //   };

  // const currentItem = generations.find((item: any) => item.id === data.id);
  //const isChecked = currentItem?.checked || false;

  return (
    <>
      <div
        className={`relative w-[300px] aspect-square rounded-xl overflow-hidden `}
        onMouseEnter={() => setIsHidden(true)}
        onMouseLeave={() => setIsHidden(false)}
      >
        <DeleteIcon
          className={`absolute top-2 right-2 z-[2] cursor-pointer`}
          style={{ color: "#F10641", display: "block" }}
          onClick={handleDelete}
        />

        <div
          id="img-container"
          className="flex items-center justify-center relative w-full h-full group"
        >
          <img
            src={data.path as string}
            alt={data.fn as string}
            className={`z-[1] w-full h-full object-contain ${
              selectedGenerations.length > 0 && "cursor-pointer"
            }`}
          />
          {/* <div
            id="bg-overlay"
            className="transition-transform duration-500 ease-in-out translate-y-96 group-hover:translate-y-0 group-hover:flex items-center justify-center absolute z-[2] w-full h-full bg-primary-light rounded-lg shadow-md pointer-events-auto cursor-pointer"
          >
            <div className="text-center w-full h-full flex flex-col items-center justify-around">
              <h3 className="text-white mb-2">
                {data.fn !== "txt2img"
                  ?
                    st(data.fn)
                  : data.fn || "Função não disponível"}
              </h3>
              <p
                className="text-white m-0 text-sm"
                onClick={() => handleOpen()}
              >
                <Visibility className="text-white text-lg" />{" "}
                {t("view-image-modal.view")}
              </p>
            </div>
          </div> */}
        </div>
      </div>
   
    </>
  );
}
