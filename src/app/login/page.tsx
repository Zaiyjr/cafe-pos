'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Coffee, Store, Loader2 } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (loginEmail: string, loginPassword: string) => {
    setError('');
    setIsLoading(true);

    const result = await signIn('credentials', {
      email: loginEmail,
      password: loginPassword,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      setError('ອີເມວ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ');
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  const handleDemoLogin = () => {
    setEmail('owner@demo.com');
    setPassword('demo123');
    handleLogin('owner@demo.com', 'demo123');
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-gray-100 p-6 min-h-screen">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-2xl mb-4">
            <Coffee className="text-amber-700" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            Cafe Management
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            ເຂົ້າສູ່ລະບົບເພື່ອຈັດການຮ້ານ ແລະ ເບິ່ງຍອດຂາຍ
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              ອີເມວ
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              ລະຫັດຜ່ານ
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 active:scale-[0.98] transition-all shadow-md shadow-amber-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : null}
            ເຂົ້າສູ່ລະບົບ
          </button>
        </form>

        <div className="mt-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Demo
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="flex items-center gap-3 w-full h-14 px-4 rounded-2xl bg-gray-800 text-white font-semibold hover:bg-gray-900 active:scale-[0.98] transition-all shadow-md shadow-gray-200 disabled:opacity-60"
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin shrink-0" />
            ) : (
              <Store size={20} className="shrink-0" />
            )}
          <div className="text-left">
              <p className="text-sm font-bold"> Login Demo </p>
              <p className="text-xs opacity-60">ທົດລອງເຂົ້າສູ່ລະບົບ</p>
              </div>
            
          </button>

         
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-gray-500">
          <Loader2 className="animate-spin" size={24} />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
