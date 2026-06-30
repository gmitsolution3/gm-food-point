import { useFetch } from "@/hooks/swr/useFetch";
import { ICategory, IMeta } from "@/types";
import { motion } from "motion/react";
import { useState } from "react";
import CategoryTabError from "./CategoryTabError";
import CategoryTabLoader from "./CategoryTabLoader";

export interface ICategoryResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta: IMeta;
  data: ICategory[];
}

interface IProps {
  selectedCategory: string; // Category ID
  onChange: (categoryId: string) => void;
}

export default function CategoryTabs({
  selectedCategory,
  onChange,
}: IProps) {
  const [page] = useState(1);
  const [limit] = useState(50);
  const [isActive] = useState(true);

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    isActive: isActive.toString(),
  });

  const { data, isLoading, isError, refetch } =
    useFetch<ICategoryResponse>(
      `/categories?${queryParams.toString()}`,
    );

  if (isLoading) {
    return <CategoryTabLoader />;
  }

  if (isError) {
    return <CategoryTabError refetch={refetch} />;
  }

  const categories = data?.data || [];

  const isAllCategory = selectedCategory === "";

  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onChange("")}
        className="relative shrink-0 rounded-full border-2 px-5 py-2.5 text-sm font-bold transition-colors"
        style={{
          borderColor: isAllCategory
            ? "var(--primary)"
            : "var(--border)",
          color: isAllCategory
            ? "var(--primary-foreground)"
            : "var(--foreground)",
        }}
      >
        {isAllCategory && (
          <motion.span
            layoutId="active-cat"
            className="absolute inset-0 rounded-full bg-primary"
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 32,
            }}
          />
        )}
        <span className="relative z-10">All</span>
      </motion.button>
      {categories.map((category) => {
        const isActive = selectedCategory === category._id;
        return (
          <motion.button
            key={category._id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(category._id)}
            className="relative shrink-0 rounded-full border-2 px-5 py-2.5 text-sm font-bold transition-colors"
            style={{
              borderColor: isActive
                ? "var(--primary)"
                : "var(--border)",
              color: isActive
                ? "var(--primary-foreground)"
                : "var(--foreground)",
            }}
          >
            {isActive && (
              <motion.span
                layoutId="active-cat"
                className="absolute inset-0 rounded-full bg-primary"
                transition={{
                  type: "spring",
                  stiffness: 380,
                  damping: 32,
                }}
              />
            )}
            <span className="relative z-10">{category.name}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
