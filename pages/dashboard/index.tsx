"use client";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Container } from "@mui/system";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import Head from "next/head";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Footer } from "../../dashboard/components/Footer";
import { LoadingIndicator } from "../../dashboard/components/LoadingIndicator";

import Speeches from "../../dashboard/components/Speeches";
import { BLACK } from "../../dashboard/modules/constants";

// document.body.style.backgroundColor = "#000000f2";
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});
const queryClient = new QueryClient();
function App() {
  useEffect(() => {
    document.title = "ParlSpeechTracker";
  }, []);

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Container
              maxWidth="lg"
              style={{
                backgroundColor: BLACK,
                height: "100%",
                paddingBottom: 300,
              }}
            >
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
          </ThemeProvider>
        </LocalizationProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
