import { toast } from "react-toastify";

export function logout(): void {
  const token = localStorage.getItem("token");

  if (token) {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    toast.success("Usuário deslogado com sucesso!");
  } else {
    console.log("Nenhum token encontrado. Usuário já está deslogado.");
  }
}
