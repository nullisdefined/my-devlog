import type { Metadata } from "next";
import type { ReactNode } from "react";
import AdminLayoutClient from "./layout-client";

export const metadata: Metadata = {
  title: "Admin | nullisdefined",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
