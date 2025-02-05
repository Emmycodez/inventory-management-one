import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google"; // Import Bricolage Grotesque
import "./globals.css";
import DashboardWrapper from "./dashboardWrapper";

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Add more if required
  display: "swap",
});

export const metadata: Metadata = {
  title: "Inventory Management System | Streamline Your Business Operations",
  description:
    "Efficiently manage your inventory with our advanced Inventory Management System. Track stock levels, automate reordering, and optimize your supply chain for better business performance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bricolageGrotesque.className} antialiased`}>
        <DashboardWrapper>{children}</DashboardWrapper>
      </body>
    </html>
  );
}
