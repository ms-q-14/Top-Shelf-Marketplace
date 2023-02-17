export const getExpressBaseURI = () => {
  const URI = import.meta.env.VITE_EXPRESS_URI || "";
  console.log(URI);
  console.log("NEW");
  return URI;
};
