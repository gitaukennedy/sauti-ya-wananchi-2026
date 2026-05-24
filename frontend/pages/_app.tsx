import '../globals.css'; // This line injects the Tailwind styles globally!
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}