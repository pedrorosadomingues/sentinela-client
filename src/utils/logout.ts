import { toast } from "react-toastify";

export function logout(): void {
  const token = localStorage.getItem("token");

  if (token) {
    localStorage.removeItem("token");
    toast.success("Usuário deslogado com sucesso!");
  } else {
    console.log("Nenhum token encontrado. Usuário já está deslogado.");
  }
}
