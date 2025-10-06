export interface MenuOption {
  id: string;
  name: string;
  price: number;
  veg?: boolean;
  image?: string;
  description?: string;
}

export interface MenuOptionGroup {
  id: string;
  name: string;
  selectionType: "single" | "multi";
  required: boolean;
  options: MenuOption[];
}

export interface MenuMetadata {
  prepTime?: number;
  rating?: number;
  available?: boolean;
  category?: string[];
  cuisineType?: string;
}

export interface ConfigurableMenuItem {
  id: number;
  name: string;
  basePrice: number;
  veg: boolean;
  image: string;
  description?: string;
  optionGroups: MenuOptionGroup[];
  metadata?: MenuMetadata;
}
export const CUSTOM_BURGER: ConfigurableMenuItem = {
  id: 101,
  name: "Build Your Own Burger",
  basePrice: 150,
  veg: false,
  image: "/images/custom-burger.jpg",
  description:
    "Customize your burger with choice of buns, fillings, sauces, and add-ons.",
  optionGroups: [
    {
      id: "bun",
      name: "Choose Your Bun",
      selectionType: "single",
      required: true,
      options: [
        { id: "bun1", name: "Classic Bun", price: 10 },
        { id: "bun2", name: "Whole Wheat Bun", price: 20 },
        { id: "bun3", name: "Sesame Seed Bun", price: 30 },
        { id: "bun4", name: "Gluten-Free Bun", price: 40 },
      ],
    },
    {
      id: "sauces",
      name: "Choose Sauces",
      selectionType: "multi",
      required: false,
      options: [
        { id: "mayo", name: "Mayonnaise", price: 20 },
        { id: "peri", name: "Peri Peri Sauce", price: 60 },
      ],
    },
  ],
  metadata: {
    prepTime: 10,
    rating: 4.6,
    available: true,
    category: ["Burger", "Customizable", "Meal"],
  },
};

export function fetchApi(): Promise<ConfigurableMenuItem> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(CUSTOM_BURGER);
    }, Math.floor(Math.random() * 1000));
  });
}
