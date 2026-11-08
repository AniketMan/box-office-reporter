import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TypicalGround } from "@typglow/sdk/ui";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "@fontsource/montserrat/200.css";
import "@fontsource/montserrat/800.css";
import "@fontsource/montserrat/900.css";
import "./theme.css";

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("missing #root element");
}

const queryClient = new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } } });

createRoot(rootEl).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* A fixed ground: the app is black and white rather than following the time of day. */}
      <TypicalGround follow={false}>
        <App />
      </TypicalGround>
    </QueryClientProvider>
  </StrictMode>,
);
