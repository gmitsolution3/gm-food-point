import { requireAuth } from "@/lib/requireAuth";
import { EROLES } from "@/types";
import Configure from "./Configure";

export default async function ConfigurePage() {
  await requireAuth([EROLES.MANAGER]);
  return <Configure />;
}
