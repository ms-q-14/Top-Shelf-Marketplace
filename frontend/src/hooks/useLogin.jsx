import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { toast } from "react-toastify";
import { getExpressBaseURI } from "../utils/constants";
export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();
  const nav = useNavigate();

  const login = async (username, password) => {
    setIsLoading(true);
    setError(null);

    // Make sure to properly stringify the request body object
    const requestBody = JSON.stringify({ password, username });

    // Set the "Content-Type" header to "application/json"
    const headers = { "Content-Type": "application/json" };

    // const response = await axiosClient.post("/user/login", requestBody, {
    //   headers,
    //   withCredentials: true,
    //   cors: true,
    // });
    const response = await fetch(`${getExpressBaseURI()}/api/user/login`, {
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
      console.log("fag");
      localStorage.setItem("user", JSON.stringify(json));
      dispatch({ type: "LOGIN", payload: json });
      setIsLoading(false);
      nav("/");
    }
  };
  return { login, isLoading, error };
};
//Possibly have json file send token and username
