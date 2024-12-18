import { Sidebar } from "@/components/sidebar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Sidebar/>
      <div className="flex-1">
      <Component {...pageProps} />
      </div>
    </div>
  )
}
