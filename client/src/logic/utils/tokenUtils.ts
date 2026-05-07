export const isTokenExpired = (token: string | null) => {
  if (!token) return true;
  try {
    // Получаем время истечения токена
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    return Date.now() >= exp;
  } catch {
    return true;
  }
};