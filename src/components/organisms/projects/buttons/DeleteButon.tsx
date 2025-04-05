// "use client";

// import { useGenerationStore } from "@/stores/generationStore";
// import { useUserStore } from "@/stores/userStore";
// import { useEffect, useState } from "react";
// import ConfirmationModal from "@/components/molecules/modals/ConfirmationModal";
// import { useGlobalStore } from "@/stores/globalStore";
// import { useProjectStore } from "@/stores/projectStore";
// import { useToast } from "@/hooks/useToast";
// import { Button, Tooltip } from "@nextui-org/react";
// import { DeleteOutlined } from "@mui/icons-material";
// import { useTranslations } from "next-intl";

// export default function DeleteButton({ isIconOnly }: { isIconOnly?: boolean }) {
//   const t = useTranslations("projects.delete_button");
//   const {
//     selectedGenerations,
//     handleDeleteSelectedGenerations,
//     setselectedGenerations,
//     setisCheckedSelectAllBtn,
//   } = useGenerationStore();
//   const { user } = useUserStore();
//   const { openConfirmation, closeConfirmation } = useGlobalStore();
//   const { setIsLoading, getProjectById, selectedProjectId } = useProjectStore();

//   const [isOpen, setIsOpen] = useState(false);
//   const toast = useToast();

//   // Função para deletar imagens
//   const handleDelete = async () => {
//     setisCheckedSelectAllBtn(false);

//     openConfirmation(
//       t("confirmation_title"),
//       t("confirmation_message"),
//       async () => {
//         setIsLoading(true);
//         try {
//           const body = {
//             email: user?.email,
//             generations_ids: selectedGenerations,
//           };

//           // Chamada para deletar imagens
//           await handleDeleteSelectedGenerations(options);

//           // Sucesso
//           toast.use("success", t("success_message"));
//           setselectedGenerations([]);
//           closeConfirmation();
//         } catch (error) {
//           // Erro
//           toast.use("error", t("error_message"));
//         } finally {
//           // Atualizar estado
//           await getProjectById(selectedProjectId as number);
//           setIsLoading(false);
//         }
//       },
//       () => {
//         closeConfirmation();
//       },
//       "danger"
//     );
//   };

//   useEffect(() => {
//     setIsOpen(selectedGenerations.length > 0);
//   }, [selectedGenerations]);

//   if (!isOpen) return null;

//   return (
//     <>
//       <ConfirmationModal />
//       {isIconOnly ? (
//         <Tooltip
//           content={t("button_text")}
//           placement="bottom"
//           color="foreground"
//           showArrow
//         >
//           <Button
//             type="button"
//             isIconOnly
//             radius="full"
//             size="sm"
//             variant="light"
//             onPress={handleDelete}
//           >
//             <DeleteOutlined fontSize="small" />
//           </Button>
//         </Tooltip>
//       ) : (
//         <Button
//           variant="bordered"
//           size="sm"
//           color="danger"
//           onPress={handleDelete}
//           startContent={<DeleteOutlined fontSize="small" />}
//         >
//           {t("button_text")}
//         </Button>
//       )}
//     </>
//   );
// }
