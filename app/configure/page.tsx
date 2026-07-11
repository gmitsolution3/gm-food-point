import Configure from "./Configure";
import { requireAuth } from "@/lib/requireAuth";

export default async function ConfigurePage() {
  await requireAuth(["manager"]);
  return <Configure />
}