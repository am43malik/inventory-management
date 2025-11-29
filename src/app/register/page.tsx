// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Button } from '@/components/ui/Button';
// import { Input } from '@/components/ui/Input';
// import { Alert, AlertDescription } from '@/components/ui/Alert';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
// import { UserPlus, Mail, Lock, User, Loader2, Check } from 'lucide-react';
// import Link from 'next/link';
// import { api } from '@/lib/api-client';

// export default function RegisterPage() {
//   const [formData, setFormData] = useState({
//     email: '',
//     name: '',
//     password: '',
//     confirmPassword: '',
//   });
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');

//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }

//     if (formData.password.length < 6) {
//       setError('Password must be at least 6 characters');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       await api.register(formData.email, formData.name, formData.password);
//       router.push('/dashboard');
//     } catch (err: any) {
//       setError(err.response?.data?.error || 'Registration failed');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen w-full flex items-center justify-center p-4 bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950">
//       {/* Decorative elements */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
//       </div>

//       <Card className="w-full max-w-md relative z-10 shadow-2xl border-0">
//         <CardHeader className="space-y-2 text-center">
//           <div className="flex justify-center mb-4">
//             <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-purple-500 rounded-lg flex items-center justify-center">
//               <UserPlus className="w-6 h-6 text-white" />
//             </div>
//           </div>
//           <CardTitle className="text-3xl">Create Account</CardTitle>
//           <CardDescription>Join the Inventory Shop Manager</CardDescription>
//         </CardHeader>

//         <CardContent className="space-y-6">
//           {error && (
//             <Alert type="destructive" className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
//               <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
//             </Alert>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <label className="text-sm font-medium flex items-center gap-2">
//                 <User className="w-4 h-4" />
//                 Full Name
//               </label>
//               <Input
//                 type="text"
//                 placeholder="John Doe"
//                 value={formData.name}
//                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                 required
//                 className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-medium flex items-center gap-2">
//                 <Mail className="w-4 h-4" />
//                 Email Address
//               </label>
//               <Input
//                 type="email"
//                 placeholder="you@example.com"
//                 value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                 required
//                 className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-medium flex items-center gap-2">
//                 <Lock className="w-4 h-4" />
//                 Password
//               </label>
//               <Input
//                 type="password"
//                 placeholder="At least 6 characters"
//                 value={formData.password}
//                 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                 required
//                 className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-medium flex items-center gap-2">
//                 <Check className="w-4 h-4" />
//                 Confirm Password
//               </label>
//               <Input
//                 type="password"
//                 placeholder="Confirm password"
//                 value={formData.confirmPassword}
//                 onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
//                 required
//                 className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
//               />
//             </div>

//             <Button
//               type="submit"
//               disabled={isLoading}
//               className="w-full bg-linear-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600 text-white font-semibold h-11"
//             >
//               {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
//               {isLoading ? 'Creating account...' : 'Create Account'}
//             </Button>
//           </form>

//           <div className="relative">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="px-2 bg-white dark:bg-slate-950 text-slate-500">Already registered?</span>
//             </div>
//           </div>

//           <Link href="/login">
//             <Button
//               type="button"
//               variant="outline"
//               className="w-full border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900"
//             >
//               Login to your account
//             </Button>
//           </Link>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { UserPlus, Mail, Lock, User, Loader2, Check, Eye, EyeOff, Building, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api-client';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      await api.register(formData.email, formData.name, formData.password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 dark:from-gray-900 dark:via-blue-950 dark:to-cyan-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 dark:bg-blue-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-200 dark:bg-indigo-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-cyan-200 dark:bg-cyan-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[linear-gradient(to_right,#1e40af_1px,transparent_1px),linear-gradient(to_bottom,#1e40af_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
              <Building className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              StockFlow
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Create your inventory management account
          </p>
        </div>

        <Card className="w-full shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl">
          <CardHeader className="space-y-3 text-center pb-6">
            <div className="flex justify-center mb-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                <UserPlus className="w-7 h-7 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">
              Create Your Account
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400 text-base">
              Join thousands of businesses managing their inventory efficiently
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pb-8">
            {error && (
              <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 rounded-xl">
                <AlertDescription className="text-red-700 dark:text-red-300 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-500" />
                  Full Name
                </label>
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-500" />
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-500" />
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="w-full px-4 py-3 pr-12 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Must be at least 6 characters long
                </p>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-500" />
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    className="w-full px-4 py-3 pr-12 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Register Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:transform-none disabled:hover:shadow-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">
                  Already have an account?
                </span>
              </div>
            </div>

            {/* Login Link */}
            <Link href="/login">
              <Button
                type="button"
                variant="outline"
                className="w-full border-2 border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3.5 rounded-xl transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-600"
              >
                Sign In to Your Account
              </Button>
            </Link>

            {/* Security Note */}
            <div className="text-center pt-4">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <ShieldCheck className="w-4 h-4" />
                Your data is secured with enterprise-grade encryption
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Banner */}
        <div className="mt-8 grid grid-cols-3 gap-6 text-center">
          <div className="text-gray-600 dark:text-gray-400">
            <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
            <p className="text-xs font-medium">Real-time Analytics</p>
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-2"></div>
            <p className="text-xs font-medium">Smart Inventory</p>
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            <div className="w-3 h-3 bg-purple-500 rounded-full mx-auto mb-2"></div>
            <p className="text-xs font-medium">Secure Cloud</p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Manage unlimited products</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Real-time stock tracking</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>Sales analytics & reports</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span>Multi-user collaboration</span>
          </div>
        </div>
      </div>
    </div>
  );
}