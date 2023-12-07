'use client'

import Main from "@/app/pages/Main";
import {QueryClient, QueryClientProvider} from "react-query";

const queryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <Main/>
    </QueryClientProvider>
  )
}
