import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
//import "./globals.css";
import "@/style/global.scss";
import "@/style/controls.scss";
import "@/style/dialogs.scss";
import "@/style/loaders.scss";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-dark-green/theme.css";
import { cookies } from "next/headers";
import { CookiesProvider } from 'next-client-cookies/server';
import { MainContextProvider } from "@/context/MainContext";
import MainContainer from "@/components/MainContainer";
import HeaderPage from "@/components/HeaderPage";
import LeftMenuPage from "@/components/LeftMenu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_NAME = "Vocabulary";
const SITE_DESCRIPTION = "A personal online vocabulary for language learners: track words with transcription and translation, word forms, and verb conjugations across tenses.";

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "vocabulary",
    "language learning",
    "flashcards",
    "transcription",
    "translation",
    "verb conjugation",
    "word forms",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark light",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let theme = "theme-dark";
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get('theme');
  theme = themeCookie ? themeCookie.value : "theme-dark";

  const projectIdCookie = cookieStore.get('project_id');
  const project_id = projectIdCookie?.value;

  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" integrity="sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      </head>
      <CookiesProvider>
        <body className={"" + theme}>
          <MainContextProvider>
            <HeaderPage></HeaderPage>
            <div className="voc-container print-section">
              <LeftMenuPage></LeftMenuPage>
              <div className="voc-data">
                <MainContainer project_id={ project_id || "" }>
                  {children}
                </MainContainer>
              </div>
            </div>
          </MainContextProvider>
        </body>
      </CookiesProvider>
    </html>
  );
}
