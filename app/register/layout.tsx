import ToggleTheme from "@/components/shared/theme-toggle";
import { TanstackProvider } from "@/providers/TanstackProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
export const metadata = {
  title: "Next.js",
  description: "Generated by Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TanstackProvider>
      <ThemeProvider>
        <html lang="en">
          <body className="bg-white dark:bg-background">
            <header className="flex justify-end pt-2 pr-5">
              <ToggleTheme />
            </header>
            <main>{children}</main>
          </body>
        </html>
      </ThemeProvider>
    </TanstackProvider>
  );
}
