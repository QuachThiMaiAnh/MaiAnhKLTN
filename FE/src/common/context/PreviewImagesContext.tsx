import { createContext, useContext, useState, ReactNode } from "react";

const PreviewImagesContext = createContext<
  | {
      previewImages: { [key: string]: string | "" };
      setPreviewImages: React.Dispatch<
        React.SetStateAction<{ [key: string]: string | "" }>
      >;
    }
  | ""
>("");

export const PreviewImagesProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [previewImages, setPreviewImages] = useState<{
    [key: string]: string | "";
  }>({});
  return (
    <PreviewImagesContext.Provider value={{ previewImages, setPreviewImages }}>
      {children}
    </PreviewImagesContext.Provider>
  );
};

export const usePreviewImages = () => {
  const context = useContext(PreviewImagesContext);
  if (!context) {
    throw new Error("usePreviewImages must be used within a Provider");
  }
  return context;
};
