import { IconButton } from "@mui/material";
import { BLUE } from "../modules/constants";
import { KeyboardDoubleArrowDown } from "@mui/icons-material";

type DownArrowProps = {
    detailOpen: boolean
    onClick: () => void;
}
export default function DownArrow({
    detailOpen,
    onClick,
}: DownArrowProps) {
    return <div style={{ justifyContent: "center", display: "flex" }}>
      <IconButton
        onClick={onClick}
        style={{
          backgroundColor: detailOpen ? BLUE : undefined,
        }}
      >
        <KeyboardDoubleArrowDown fontSize="large" />
      </IconButton>
    </div>;
  }
