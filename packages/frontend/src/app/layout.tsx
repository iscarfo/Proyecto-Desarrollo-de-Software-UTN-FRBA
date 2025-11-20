import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Poppins } from "next/font/google";
import theme from "@/theme";
<<<<<<< HEAD
import { ThemeProvider } from '@mui/material/styles';
import { ClerkProvider } from '@clerk/nextjs';
||||||| 652cc4f
import { ThemeProvider } from '@mui/material/styles';
=======
import { ThemeProvider } from "@mui/material/styles";
import { CartProvider } from "../store/CartContext";
>>>>>>> development

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata = {
  title: "Tienda Sol",
  description: "Trabajo Práctico de Desarrollo de Software - Grupo 6",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
<<<<<<< HEAD
    <ClerkProvider>
      <html lang="en" className={poppins.variable}>
        <body>
          <AppRouterCacheProvider options={{ key: 'css', enableCssLayer: true }}>
            <ThemeProvider theme={theme}>
              {children}
            </ThemeProvider>
          </AppRouterCacheProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
||||||| 652cc4f
    <html lang="en" className={poppins.variable}>
      <body>
        <AppRouterCacheProvider options={{ key: 'css', enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
=======
    <html lang="en" className={poppins.variable}>
      <head />
      <body>
        <AppRouterCacheProvider options={{ key: "css", enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            <CartProvider>{children}</CartProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
>>>>>>> development
