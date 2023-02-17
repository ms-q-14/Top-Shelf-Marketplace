import { useAuthContext } from "./useAuthContext";
import { getExpressBaseURI } from "../utils/constants";
export const useLogout = () => {
  const { dispatch } = useAuthContext();

  const logout = async () => {
    //remove user from storage
    localStorage.removeItem("user");

    const response = await fetch(`${getExpressBaseURI()}/api/user/logout`, {
      method: "POST",
      credentials: "include",
    });

    //dispatch logout action
    dispatch({ type: "LOGOUT" });
  };
  return { logout };
};
