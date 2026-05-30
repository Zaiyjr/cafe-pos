import type { Metadata } from "next";
import { Noto_Sans_Lao } from "next/font/google";
import "./globals.css";

// ດຶງຟອນ Noto Sans Lao ມາໃຊ້
const notoLaos = Noto_Sans_Lao({
  variable: "--font-noto-lao",
  subsets: ["lao"],
  weight: ["300", "400", "500", "600", "700"], // ເອົາຄວາມໜາທີ່ຈຳເປັນມາໃຊ້
});

export const metadata: Metadata = {
  title: "Cafe POS System",
  description: "ລະບົບຈັດການໜ້າຮ້ານກາເຟ ແລະ ຫຼັງບ້ານ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="lo" // ປ່ຽນເປັນ lo (Lao)
      className={`${notoLaos.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-gray-50 text-zinc-900">
        {children}
      </body>
    </html>
  );
}