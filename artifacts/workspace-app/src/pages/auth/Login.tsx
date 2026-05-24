import { useAuth } from "@/context/AuthContext";
import { useLogin } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { Loader2, Mail, Lock } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { login: setAuthContext } = useAuth();
  const [, setLocation] = useLocation();
  const loginMutation = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(
      { data },
      {
        onSuccess: (response) => {
          toast.success("Logged in successfully");
          setAuthContext(response);
          setLocation("/dashboard");
        },
        onError: (error) => {
          toast.error(error.data?.error || "Login failed");
        },
      }
    );
  };

  return (
    <AuthLayout title="SIGN IN" subtitle="Sign in with email address">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                 <FormItem>
                   <FormControl>
                     <div className="relative">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                       <Input 
                         className="pl-12 bg-[#1a1136] border-transparent text-white placeholder:text-white/40 h-14 rounded-xl focus-visible:ring-purple-500 focus-visible:border-purple-500 shadow-inner" 
                         placeholder="Yourname@gmail.com" 
                         {...field} 
                       />
                     </div>
                   </FormControl>
                   <FormMessage />
                 </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                 <FormItem>
                   <FormControl>
                     <div className="relative">
                       <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                       <Input 
                         type="password" 
                         className="pl-12 bg-[#1a1136] border-transparent text-white placeholder:text-white/40 h-14 rounded-xl focus-visible:ring-purple-500 focus-visible:border-purple-500 shadow-inner" 
                         placeholder="Password" 
                         {...field} 
                       />
                     </div>
                   </FormControl>
                   <div className="flex justify-end mt-2">
                     <Link href="/forgot-password" className="text-xs text-white/60 hover:text-white hover:underline transition-colors">
                       Forgot password?
                     </Link>
                   </div>
                   <FormMessage />
                 </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full h-14 bg-gradient-to-r from-[#6938c4] to-[#4261b5] hover:opacity-90 transition-opacity rounded-xl text-lg font-semibold shadow-lg shadow-purple-900/50 text-white" disabled={loginMutation.isPending}>
            {loginMutation.isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            Sign In
          </Button>

          <p className="mt-8 text-sm text-white/60 font-medium pt-4 text-center">
            Don't have an account? <Link href="/signup" className="text-purple-500 hover:underline">Sign up</Link>
          </p>
        </form>
      </Form>
    </AuthLayout>
  );
}
