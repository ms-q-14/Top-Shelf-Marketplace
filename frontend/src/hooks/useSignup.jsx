import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";
import { getExpressBaseURI } from "../utils/constants";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();
  const nav = useNavigate();

  const signup = async ({ email, username, password }) => {
    setIsLoading(true);
    setError(null);

    // Make sure to properly stringify the request body object
    const requestBody = JSON.stringify({ email, password, username });

    // Set the "Content-Type" header to "application/json"
    const headers = { "Content-Type": "application/json" };

    const response = await fetch(`${getExpressBaseURI()}/api/user/register`, {
      method: "POST",
      headers,
      body: requestBody,
      credentials: "include",
    });
    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
      console.log(error);
    }

    if (response.ok) {
      // localStorage.setItem("user", JSON.stringify(json));

      // //Could remove if you dont want automatic login once registered
      // dispatch({ type: "LOGIN", payload: json });

      setIsLoading(false);
      nav("/login");
    }
  };
  return { signup, isLoading, error };
};
//Possibly have json file send token and username
