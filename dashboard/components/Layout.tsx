import { Container, CssBaseline, Typography } from "@mui/material";
import { Footer } from "./Footer";
import { OptedLogo } from "./OptedLogo";
import { BLACK } from "../modules/constants";
// import "../../styles/globals.css";

export function Layout({ children }: any) {
  return (
    <div
      style={{
        backgroundColor: BLACK,
        color: "#fff",
        height: "100%",
      }}
    >
      <CssBaseline />
      <Container maxWidth="lg">
        <div className="App">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              marginBottom: "10px",
              paddingTop: 15,
            }}
          >
            <a href="/">
              <OptedLogo width={55} />
            </a>
            <Typography
              style={{ marginTop: "5px" }}
              fontSize={"1.2rem"}
              variant="caption"
              color="white"
            >
              ParlSpeechTracker
            </Typography>
          </div>
          <div>{children}</div>
        </div>
        <Footer style={{ marginTop: "190px", marginBottom: "20px" }} />
      </Container>
    </div>
  );
}
