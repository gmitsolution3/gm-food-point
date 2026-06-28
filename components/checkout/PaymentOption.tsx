import { ComponentType } from "react";
import FulFillmentOption from "./FulFillmentOption";

export function PaymentOption(props: {
  active: boolean;
  onClick: () => void;
  Icon: ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return <FulFillmentOption {...props} />;
}