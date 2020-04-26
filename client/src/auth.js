export const isAuthenticated = () => getToken();
export const getUser = () => JSON.parse(localStorage.getItem("user"))
export const setUser = (data) => localStorage.setItem("user", JSON.stringify(data.user));
export const getToken = () => localStorage.getItem("loginToken");
export const login = data => { localStorage.setItem("loginToken", data.token); setUser(data) }
export const logout = () => { localStorage.clear() }
