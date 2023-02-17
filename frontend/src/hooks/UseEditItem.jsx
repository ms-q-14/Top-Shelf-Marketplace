import { useState } from "react";
import { getExpressBaseURI } from "../utils/constants";

export const UseEditItem = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const edit = async ({ form, id }) => {
    setIsLoading(true);
    setError(null);

    const requestBody = form;

    const response = await fetch(`${getExpressBaseURI()}/api/product/${id}`, {
      method: "PATCH",
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
      setIsLoading(false);
    }
  };
  return { edit, isLoading, error };
};
