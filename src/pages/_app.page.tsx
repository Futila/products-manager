import { Sidebar } from "@/components/sidebar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "sonner";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Toaster richColors position="top-right"/>
      <Sidebar/>
      <div className="flex-1">
      <Component {...pageProps} />
      </div>
    </div>
  )
}
