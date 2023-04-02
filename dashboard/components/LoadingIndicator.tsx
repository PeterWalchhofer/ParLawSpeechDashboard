import { Box, LinearProgress } from "@mui/material";
import { useIsFetching } from "react-query";

export function LoadingIndicator() {
  const isFetching = useIsFetching();

  return (
    <Box
      sx={{
        width: "100%",
        display: "absolute",
        position: "fixed",
        top: 0,
        visibility: isFetching ? "visible" : "hidden",
      }}
    >
      <LinearProgress variant="query" />
    </Box>
  );
}
