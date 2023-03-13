"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactElement, ReactNode } from "react";

const queryClient = new QueryClient();

interface ReactQueryWrapperProps {
  children: ReactNode;
}
export const ReactQueryWrapper = ({
  children,
}: ReactQueryWrapperProps): ReactElement => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
