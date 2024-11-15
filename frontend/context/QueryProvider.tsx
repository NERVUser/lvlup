import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { PropsWithChildren } from 'react';

const client = new QueryClient();

const QueryProvider = ({children}) => {
  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  )
}

export default QueryProvider