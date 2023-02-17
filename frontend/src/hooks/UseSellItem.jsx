import { useState } from "react";
import { getExpressBaseURI } from "../utils/constants";
export const UseSellItem = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const sell = async (sellform) => {
    try {
      setIsLoading(true);
      setError(null);

      const requestBody = sellform;

      const response = await fetch(`${getExpressBaseURI()}/api/product/`, {
        method: "POST",
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
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };
  return { sell, isLoading, error };
};
