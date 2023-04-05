import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { Indices, useAmcatIndices, useMiddlecatContext } from "../../../amcat4react";
import CreateIndex from "../../../amcat4react/components/Indices/CreateIndex";
import { useHasGlobalRole } from "../../../amcat4react/hooks/useCurrentUserDetails";
import { link_query } from "../../../functions/links";

export default function IndexSelection() {
  const router = useRouter();
  const { user } = useMiddlecatContext();
  const indices = useAmcatIndices();
  const is_writer = useHasGlobalRole(user, "WRITER");

  function onSelectIndex(index: string) {
    if (!user) return;
    router.push(link_query(user.resource, index));
  }

  if (!user || !indices.data) return;

  return (
    <>
      <div>{!is_writer ? null : <CreateIndex user={user} onCreate={() => indices.refetch()} />}</div>
      <div style={{marginTop: "15px"}}>
      <Button
              variant="outlined"
              style={{
                fontSize: "1.5rem",
                color: "green",
                borderColor: "green",
              }}
              onClick={() => router.push("/dashboard")}
            >
              Dashboard
            </Button>
            </div>
      <h2>{indices.data.length > 0 ? "Select index" : "No indices available"}</h2>
      <Indices user={user} onSelect={onSelectIndex} />
    </>
  );
}
