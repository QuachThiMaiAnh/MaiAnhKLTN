export interface Slide {
    _id: string;
    type: "product" | "homepage";
    title: string;
    subtitle?: string;
    image?: string;
    backgroundImage?: string;
    description?: string;
    features?: string[];
    price?: number;
    promotionText?: string;
    textsale?: string;
    callToActions?: {
      label: string;
      link: string;
      isActive: boolean;
    }[];
    contentPosition?: "left" | "right" | "center";
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }
  

  export interface FormValuesSlide {
    type: string;
    title: string;
    subtitle?: string;
    description?: string;
    price?: number;
    features?: string[];
    promotionText?: string;
    textsale?: string;
    image?: FileList | null;
    backgroundImage?: FileList | null;
    callToActions?: {
      label: string;
      link: string;
      isActive?: boolean;
    }[];
  }