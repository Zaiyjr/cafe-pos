import Link from 'next/link';
import { auth } from '@/auth';
import { LogoutButton } from '@/components/logoutButton';

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-gray-100 p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
        <span className="text-5xl">☕</span>
        <h1 className="text-3xl font-bold text-gray-800 mt-4 tracking-tight">
          Cafe Management
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          ສະບາຍດີ, <strong>{session?.user?.name}</strong>
        </p>
        <p className="text-xs text-gray-400 mt-1">
          ຈັດການຮ້ານກາເຟ ຂາຍສິນຄ້າ ແລະ ເບິ່ງຍອດຂາຍ
        </p>

        <div className="mt-8 space-y-4">
          <Link
            href="/pos"
            className="flex items-center justify-center gap-3 w-full h-14 rounded-2xl bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 active:scale-[0.98] transition-all shadow-md shadow-blue-200"
          >
            🛒 ໜ້າຂາຍ (POS)
          </Link>

          <Link
            href="/admin"
            className="flex items-center justify-center gap-3 w-full h-14 rounded-2xl bg-gray-800 text-white font-semibold text-lg hover:bg-gray-900 active:scale-[0.98] transition-all shadow-md shadow-gray-200"
          >
            📊 ເບິ່ງຍອດຂາຍ
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <LogoutButton className="mx-auto text-sm text-gray-500 hover:text-red-600 font-medium" />
        </div>

        <div className="mt-4 text-xs text-gray-400">
          ພັດທະນາໂດຍ <strong>Zaiy.DEV</strong>
        </div>
      </div>
    </div>
  );
}
