import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";

const Home = lazy(() => import("./pages/Home"));
const Explorer = lazy(() => import("./pages/Explorer"));
const Admin = lazy(() => import("./pages/Admin"));
const Entrance = lazy(() => import("./pages/Entrance"));
const Contribute = lazy(() => import("./pages/Contribute"));
const OpenSource = lazy(() => import("./pages/OpenSource"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
});

export default function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Suspense>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explorer" element={<Explorer />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/entrance" element={<Entrance />} />
              <Route path="/contribute" element={<Contribute />} />
              <Route path="/open-source" element={<OpenSource />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
