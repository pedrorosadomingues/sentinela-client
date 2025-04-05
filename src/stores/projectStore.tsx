/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { getAllProjects } from "@/services/project";
import { useUserStore } from "./userStore";
import { useFnStore } from "./fnStore";
import { axiosClient } from "@/lib/axios/axiosClient";

interface ProjectStoreProps {
  getAllProjects: () => Promise<void>;
  projects: any[];
  setProjects: (projects: any[]) => void;
  getProjectById: (id: number) => Promise<void>;
  project: any;
  setProject: (project: any) => void;
  patchProject: (id: string, name: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  postProject: (name: string, user_id: string) => Promise<void>;

  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;

  data: any;
  setData: (data: any) => void;

  selectedFolderId: number | null;
  setSelectedFolderId: (selectedFolderId: number | null) => void;

  selectedProjectId: number | null;
  setSelectedProjectId: (selectedProjectId: number | null) => void;

  handleCreate: (
    key: "folder" | "project",
    value: string
  ) => Promise<{ success: boolean; message: string }>;

  isCreating: boolean;
  setIsCreating: (isCreating: boolean) => void;

  inputValue: string;
  setInputValue: (inputValue: string) => void;

  createItem: (url: string, body: { name: string }) => Promise<void>;

  isLoadingCreate: boolean;
  setIsLoadingCreate: (isLoadingCreate: boolean) => void;

  refreshCurrentFolder: (project_id: number) => Promise<void>;

  t: any;
  setTranslations: (t: any) => void;

  handleUpdateProject: (
    key: "folder" | "project",
    updates: any
  ) => Promise<{ success: boolean; message: string }>;
  handleDeleteProject: (
    key: "folder" | "project",
    options: any
  ) => Promise<{ success: boolean; message: string }>;

  isFetching: boolean;
}

export const useProjectStore = create<ProjectStoreProps>((set) => ({
  isFetching: false,
  isLoadingCreate: false,
  setIsLoadingCreate: (isLoadingCreate) => set({ isLoadingCreate }),
  projects: [],
  setProjects: (projects: any[]) => set({ projects }),
  project: {},
  setProject: (project: any) => set({ project }),
  getAllProjects: async () => {
   set({ isFetching: true });
   
       try {
         const response = await getAllProjects();
   
         if (response.status === 200) {
           set({ projects: response.data });
         } else {
           console.error(response.message);
         }
       } catch (error) {
         console.error("Failed to fetch generations", error);
       } finally {
         set({ isFetching: false });
       }
  },
  getProjectById: async (id: number) => {
    const { setProject } = useProjectStore.getState();
    const response = await axiosClient.get(`/project/${id}`);
    if (response.status === 200) {
      setProject(response.data);
    }
  },
  patchProject: async (id: string, name: string) => {
    // Default implementation
    console.log(`Patching project with id: ${id}, name: ${name}`);
  },
  deleteProject: async (id: string) => {
    // Default implementation
    console.log(`Deleting project with id: ${id}`);
  },
  postProject: async (name: string, user_id: string) => {
    // Default implementation
    console.log(`Posting project with name: ${name}, user_id: ${user_id}`);
  },

  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),

  data: {},
  setData: (data) => set({ data }),

  selectedFolderId: null,
  setSelectedFolderId: (selectedFolderId) => set({ selectedFolderId }),

  selectedProjectId: null,
  setSelectedProjectId: (selectedProjectId) => set({ selectedProjectId }),

  handleCreate: async (
    key: "folder" | "project",
    value: string
  ): Promise<{ success: boolean; message: string }> => {
    const { user } = useUserStore.getState();
    const { selectedProjectId, createItem, t } = useProjectStore.getState();

    let url = "";
    const body = { name: value };

    if (key === "folder") {
      if (!selectedProjectId) {
        return Promise.resolve({
          success: false,
          message: t("create_file.FSCF-D400"), // Erro de validação
        });
      }
      url = `/api/paste?email=${user?.email}&project_id=${selectedProjectId}`;
    } else if (key === "project") {
      url = `/api/project?email=${user?.email}`;
    }

    // Tenta criar o item e retorna o status
    return createItem(url, body)
      .then(() => ({
        success: true,
        message: t("create_file.FSCF-S200"), // Sucesso
      }))
      .catch((err: any) => {
        console.error(`Erro ao criar ${key}:`, err);
        return {
          success: false,
          message: t("create_file.FSCF-D500"), // Erro interno no servidor
        };
      });
  },

  isCreating: false,
  setIsCreating: (isCreating) => set({ isCreating }),

  inputValue: "",
  setInputValue: (inputValue) => set({ inputValue }),

  createItem: async (url: string, body: Record<string, any>) => {
    const { toast } = useFnStore.getState();
    const {
      setIsLoadingCreate,
      setIsCreating,
      setInputValue,
      getAllProjects,
      getProjectById,
      refreshCurrentFolder,
      selectedProjectId,
      t,
    } = useProjectStore.getState();
    //const { user } = useUserStore.getState();

    setIsLoadingCreate(true);

    try {
      const response = await axiosClient.post(url, body);

      // Verifica se a resposta é bem-sucedida
      if (response.status === 201 || response.status === 200) {
        toast && toast("success", t("create_file.FSCF-S200")); // Mensagem de sucesso

        // Atualizar a lista de projetos e a pasta atual
        await getAllProjects();
        await getProjectById(selectedProjectId as number);
        await refreshCurrentFolder(selectedProjectId as number);

        // Limpar o input e fechar o modal
        setInputValue("");
        setIsCreating(false);
      } else {
        toast && toast("error", t("create_file.FSCF-D1")); // Erro genérico
      }
    } catch (err: any) {
      if (err.response) {
        const { status } = err.response;

        if (status === 400) {
          toast && toast("error", t("create_file.FSCF-D400")); // Erro de validação
        } else if (status === 500) {
          toast && toast("error", t("create_file.FSCF-D500")); // Erro interno no servidor
        } else {
          toast && toast("error", t("create_file.FSCF-D1")); // Erro desconhecido
        }
      } else if (err.request) {
        toast && toast("error", t("create_file.FSCF-D0")); // Erro de conexão
      } else {
        toast && toast("error", t("create_file.FSCF-D1")); // Erro inesperado
      }

      if (process.env.NODE_ENV === "development") {
        // console.error("Erro ao criar item:", err);
      }
    } finally {
      setIsLoadingCreate(false);
    }
  },

  refreshCurrentFolder: async (project_id: number) => {
    const { selectedProjectId, setData } = useProjectStore.getState();

    if (selectedProjectId) {
      try {
        const response = await axiosClient.get(
          `/api/project?project_id=${project_id}`
        );
        if (!response.data) return;

        const updatedProject = response.data;

        if (
          updatedProject &&
          "pastes" in updatedProject &&
          updatedProject.pastes
        ) {
          setData(updatedProject.pastes as any);
        }
      } catch (error) {
        console.error("Erro ao obter projeto:", error);
      }
    }
  },

  t: null,
  setTranslations: (t: any) => set({ t }),

  handleUpdateProject: async (
    key: "folder" | "project",
    updates: any
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const { name, requester_email, paste_id, project_id } = updates;
      const { projects } = useProjectStore.getState();
      const updateObj = {
        name: name,
      };

      const renameProject = async () => {
        const url = `/api/project?project_id=${project_id}&email=${requester_email}`;
        return axiosClient.put(url, updateObj);
      };

      const renameFolder = async () => {
        const url = `/api/paste?paste_id=${paste_id}&project_id=${project_id}&email=${requester_email}`;
        return axiosClient.put(url, updateObj);
      };

      let response;

      if (key === "project") {
        response = await renameProject();

        const updatedProjects = projects.map((project: any) => {
          if (project.id === project_id) {
            return { ...project, name: name };
          }

          return project;
        });

        set({ projects: updatedProjects });
      } else {
        response = await renameFolder();

        const updatedProjects = projects.map((project: any) => {
          if (project.id === project_id) {
            return {
              ...project,
              pastes: project.pastes.map((folder: any) => {
                if (folder.id === paste_id) {
                  return { ...folder, name: name };
                }

                return folder;
              }),
            };
          }

          return project;
        });

        set({
          project: updatedProjects.find(
            (project: any) => project.id === project_id
          ),
          projects: updatedProjects,
        });
      }

      return { success: true, message: response.data[0] };
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error;

      return { success: false, message: errorMessage };
    }
  },

  handleDeleteProject: async (
    key: "folder" | "project",
    options: any
  ): Promise<{ success: boolean; message: string }> => {
    const { project_id, paste_id, requester_email } = options;

    try {
      const deleteProject = async () => {
        const url = `/api/project?project_id=${project_id}&email=${requester_email}`;
        return axiosClient.delete(url);
      };

      const deleteFolder = async () => {
        const url = `/api/paste?paste_id=${paste_id}&project_id=${project_id}&email=${requester_email}`;
        return axiosClient.delete(url);
      };

      let response;

      if (key === "project") {
        response = await deleteProject();
      } else {
        response = await deleteFolder();
      }

      return { success: true, message: response.data[0] };
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error;
      return { success: false, message: errorMessage };
    }
  },
}));
