import { create } from "zustand";

interface ISidebarStore {
  sidebar: boolean;
  toggleSidebar: () => void;
  sidebarLayout: "minimized" | "expanded";
  setSidebarLayout: (variant: "minimized" | "expanded") => void;
  toggleSidebarLayout: () => void;
}

export const useSidebarStore = create<ISidebarStore>((set) => ({
  sidebar: true,
  toggleSidebar: () => set((state) => ({ sidebar: !state.sidebar })),

  sidebarLayout: "expanded",
  setSidebarLayout: (variant: "minimized" | "expanded") =>
    set({ sidebarLayout: variant }),
  toggleSidebarLayout: () => {
    const { sidebarLayout } = useSidebarStore.getState();

    set((state) => ({
      sidebarLayout:
        state.sidebarLayout === "minimized" ? "expanded" : "minimized",
    }));

    localStorage.setItem(
      "sidebar-layout",
      sidebarLayout === "minimized" ? "expanded" : "minimized"
    );
  },
}));

export default useSidebarStore;
