import { AdminNavigation } from "@/components/navigation/admin-navigation";
import { TopBar } from "@/components/navigation/topbar";
import { TanstackProvider } from "@/providers/TanstackProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import "../../app/globals.css";
export const metadata = {
  title: "GARC Admin",
  description: "System to perfom an Internal ,Externa and Risk Assessments",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <TanstackProvider>
        <html lang="en">
          <body className="min-h-screen flex relative">
            <header className="w-fit bg-white dark:bg-background fixed h-full">
              <AdminNavigation />
            </header>
            <main className="flex-1 flex flex-col ml-[53px] bg-white dark:bg-background">
              <TopBar />
              <div className="flex-1">{children}</div>
            </main>
          </body>
        </html>
      </TanstackProvider>
    </ThemeProvider>
  );
}
