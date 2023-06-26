import "fomantic-ui-css/semantic.min.css";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MiddlecatWrapper, useMiddlecatContext } from "../amcat4react";

import ParLawSpeech from "../dashboard/components/ParLawSpeech";
import { BLACK } from "../dashboard/modules/constants";
import { link_host } from "../functions/links";

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
  const [queryClient] = useState(() => new QueryClient());


  return (
    <div
      style={{
        backgroundColor: BLACK,
        height: "100%",
        paddingBottom: 300,
        color: "fff",
      }}
    >
      <Head>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <MiddlecatWrapper loginRoute="/" bff="/api/bffAuth">
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <ThemeProvider theme={darkTheme}>
              <CssBaseline />
              <ParLawSpeech />
            </ThemeProvider>
          </LocalizationProvider>
        </MiddlecatWrapper>
      </QueryClientProvider>
    </div>
  );
}

export default App;
