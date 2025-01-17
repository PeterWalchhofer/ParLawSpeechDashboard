import "fomantic-ui-css/semantic.min.css";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import Head from "next/head";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MiddlecatWrapper } from "../amcat4react";

import { Layout } from "../dashboard/components/Layout";
import Speeches from "../dashboard/components/Speeches";

// document.body.style.backgroundColor = "#000000f2";
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  useEffect(() => {
    document.title = "ParlSpeechTracker";
  }, []);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <div>
      <Head>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <MiddlecatWrapper loginRoute="https://middlecat.up.railway.app" bff="https://middlecat.up.railway.app/api/bffAuth">
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <ThemeProvider theme={darkTheme}>
              <CssBaseline />
              <Layout>
                <Speeches />
              </Layout>
            </ThemeProvider>
          </LocalizationProvider>
        </MiddlecatWrapper>
      </QueryClientProvider>
    </div>
  );
}

export default App;
