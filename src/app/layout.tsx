import { Layout } from "@/components/Layout/Layout";
import "./globals.css";
import { Providers } from "@/contexts/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://kit.fontawesome.com/3062cd7a80.js" />
        <script
          type="text/javascript"
          id="MathJax-script"
          async
          src="https://cdn.jsdelivr.net/npm/mathjax@3.0.0/es5/tex-chtml.js"
        ></script>
      </head>
      <body>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
