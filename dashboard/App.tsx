import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Container } from "@mui/system";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { QueryClient, QueryClientProvider } from "react-query";
import "./App.css";
import Speeches from "./components/Speeches";
import { BLACK } from "./modules/constants";

document.body.style.backgroundColor = "#000000f2";
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
  typography: {
    allVariants: {
      color: "white",
    },
  },
});
const queryClient = new QueryClient();
function App() {
  return (
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
                  color: "#fff",
                }}
              >
                <Speeches />
              </div>
            </div>
          </Container>
        </ThemeProvider>
      </LocalizationProvider>
    </QueryClientProvider>
  );
}

export default App;
