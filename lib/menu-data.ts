import { IAddOn, IMenuItem, TCategory } from "@/types";

export const CATEGORIES: Array<"All" | TCategory> = [
  "All",
  "Pizza",
  "Burger",
  "Rice",
  "Chicken",
  "Drinks",
  "Dessert",
];

const defaultAddons: IAddOn[] = [
  { id: "cheese", name: "Extra Cheese", price: 1.5 },
  { id: "mushroom", name: "Mushroom", price: 1.2 },
  { id: "fries", name: "Side Fries", price: 2.5 },
  { id: "coke", name: "Coke", price: 1.8 },
];

export const MENU: IMenuItem[] = [
  {
    id: "burger-classic",
    name: "Classic Cheeseburger",
    description:
      "Juicy beef patty, melted cheddar, fresh lettuce and tomato.",
    category: "Burger",
    price: 8.99,
    discountPrice: 6.99,
    image: "/images/food-burger.jpg",
    addons: defaultAddons,
  },
  {
    id: "burger-double",
    name: "Double Smash Burger",
    description:
      "Two smashed patties with caramelized onions and house sauce.",
    category: "Burger",
    price: 11.5,
    image: "/images/food-burger.jpg",
    addons: defaultAddons,
  },
  {
    id: "pizza-pepperoni",
    name: "Pepperoni Slice",
    description:
      "Wood-fired slice loaded with pepperoni and mozzarella.",
    category: "Pizza",
    price: 5.5,
    image: "/images/food-pizza.jpg",
    addons: defaultAddons,
  },
  {
    id: "pizza-margherita",
    name: "Margherita Pie",
    description:
      "San Marzano tomato, fresh basil and creamy mozzarella.",
    category: "Pizza",
    price: 12.0,
    discountPrice: 9.99,
    image: "/images/food-pizza.jpg",
    addons: defaultAddons,
  },
  {
    id: "chicken-bucket",
    name: "Crispy Chicken Bucket",
    description: "8 pieces of golden, hand-breaded fried chicken.",
    category: "Chicken",
    price: 14.99,
    image: "/images/food-chicken.jpg",
    addons: defaultAddons,
  },
  {
    id: "chicken-wings",
    name: "Spicy Hot Wings",
    description: "Crispy wings tossed in our signature spicy glaze.",
    category: "Chicken",
    price: 7.5,
    discountPrice: 5.99,
    image: "/images/food-chicken.jpg",
    addons: defaultAddons,
  },
  {
    id: "rice-shrimp",
    name: "Shrimp Fried Rice",
    description:
      "Wok-fired jasmine rice with shrimp and crisp vegetables.",
    category: "Rice",
    price: 9.5,
    image: "/images/food-rice.jpg",
    addons: defaultAddons,
  },
  {
    id: "rice-veggie",
    name: "Garden Veggie Rice",
    description:
      "Fragrant rice with seasonal vegetables and soy glaze.",
    category: "Rice",
    price: 7.99,
    image: "/images/food-rice.jpg",
    addons: defaultAddons,
  },
  {
    id: "drink-cola",
    name: "Iced Cola",
    description: "Classic cola served over crushed ice.",
    category: "Drinks",
    price: 2.5,
    image: "/images/food-drink.jpg",
    addons: [],
  },
  {
    id: "drink-lemon",
    name: "Fresh Lemonade",
    description: "Hand-squeezed lemons with a hint of mint.",
    category: "Drinks",
    price: 3.2,
    discountPrice: 2.5,
    image: "/images/food-drink.jpg",
    addons: [],
  },
  {
    id: "dessert-lava",
    name: "Chocolate Lava Cake",
    description: "Warm molten chocolate cake with vanilla ice cream.",
    category: "Dessert",
    price: 6.5,
    image: "/images/food-dessert.jpg",
    addons: [],
  },
  {
    id: "dessert-brownie",
    name: "Fudge Brownie",
    description:
      "Rich double-chocolate brownie with caramel drizzle.",
    category: "Dessert",
    price: 4.99,
    discountPrice: 3.99,
    image: "/images/food-dessert.jpg",
    addons: [],
  },
];
