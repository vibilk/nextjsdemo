import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Montserrat } from "next/font/google";
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getCookie } from 'cookies-next';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});


export default function App({ Component, pageProps }: AppProps) {

  return (
    <main className={montserrat.className}>
      <Component {...pageProps} />
    </main>
  );
}
