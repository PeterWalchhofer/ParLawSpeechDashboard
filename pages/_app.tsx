import "fomantic-ui-css/semantic.min.css";
import "../styles/globals.css";

import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MiddlecatWrapper } from "../amcat4react";
import TopMenu from "../components/Menu/TopMenu";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  const router = useRouter();
  const onDashboard = router.pathname === "/dashboard";
  console.log(router.pathname);

  return (
    <QueryClientProvider client={queryClient}>
      <MiddlecatWrapper loginRoute="/" bff="/api/bffAuth">
        {!onDashboard && <TopMenu />}
        <div className={onDashboard ? "dashboard" : "amcat4"}>
          <div className="Container">
            <Component {...pageProps} />
          </div>
        </div>
      </MiddlecatWrapper>
    </QueryClientProvider>
  );
}
