import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

export default function CheckoutCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="rounded-3xl bg-card shadow-[var(--shadow-soft)] p-0 sm:p-0">
      <CardHeader className="p-5 sm:p-6">
        <CardTitle className="text-base font-extrabold">
          {title}
        </CardTitle>
        {subtitle && (
          <CardDescription className="text-xs text-muted-foreground">
            {subtitle}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
        {children}
      </CardContent>
    </Card>
  );
}
