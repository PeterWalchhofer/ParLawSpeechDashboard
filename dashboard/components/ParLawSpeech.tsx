import "fomantic-ui-css/semantic.min.css";

import { createTheme } from "@mui/material/styles";
import { Container } from "@mui/system";
import useMiddlecat from "middlecat-react";
import { useEffect } from "react";
import { useMiddlecatContext } from "../../amcat4react";
import { Footer } from "./Footer";
import { LoadingIndicator } from "./LoadingIndicator";
import Speeches from "./Speeches";

// document.body.style.backgroundColor = "#000000f2";
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});
function ParLawSpeech() {
  useEffect(() => {
    document.title = "ParlSpeechTracker";
  }, []);
  const { user } = useMiddlecatContext();
  const { signInGuest } = useMiddlecat();

  useEffect(() => {
    if (user) return;
    const hostEnv = process.env.NEXT_PUBLIC_AMCAT_HOST;
    signInGuest("http://localhost/amcat", "ParLawSpeech", true);
  }, [user]);

  return (
    <div>
      <Container maxWidth="lg">
        <div className="App">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: 15,
            }}
          >
            <Speeches />
          </div>
        </div>
        <Footer style={{ marginTop: "190px" }} />
      </Container>
      <LoadingIndicator />
    </div>
  );
}

export default ParLawSpeech;
