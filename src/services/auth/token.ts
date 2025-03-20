export async function validateUserToken(token?: string) {
  if (!token) return null;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/get-user`,
      {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      return null; // Token inválido ou expirado
    }

    const sessionUser = await response.json();
    return sessionUser || null;
  } catch (error) {
    console.error("Erro ao validar o token:", error);
    return null;
  }
}
