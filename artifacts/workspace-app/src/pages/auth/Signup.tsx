import { useAuth } from "@/context/AuthContext";
import { useSignup } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { Loader2, Shield, User, Mail, Lock, UserRound } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

const roles = [
  {
    value: "member" as const,
    label: "Team Member",
    description: "Join workspaces, manage tasks, collaborate with your team.",
    icon: User,
    color: "text-blue-400",
    border: "border-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    value: "admin" as const,
    label: "Admin",
    description: "Full control — manage users, workspaces, and platform settings.",
    icon: Shield,
    color: "text-violet-400",
    border: "border-violet-500",
    bg: "bg-violet-500/10",
  },
];

export default function Signup() {
  const { login: setAuthContext } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedRole, setSelectedRole] = useState<"member" | "admin">("member");
  const signupMutation = useSignup();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = (data: SignupFormValues) => {
    signupMutation.mutate(
      { data: { ...data, role: selectedRole } as any },
      {
        onSuccess: (response) => {
          toast.success(`Account created as ${selectedRole === "admin" ? "Admin" : "Team Member"}`);
          setAuthContext(response);
          setLocation("/dashboard");
        },
        onError: (error: any) => {
          toast.error(error?.data?.error || "Registration failed");
        },
      }
    );
  };

  return (
    <AuthLayout title="SIGN UP" subtitle="Choose your role and register">
      <div className="space-y-6">
        {/* Role selector */}
        <div>
          <p className="text-sm font-medium text-white/80 mb-2">I am joining as</p>
          <div className="grid grid-cols-2 gap-3">
            {roles.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.value;
              return (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setSelectedRole(role.value)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-center transition-all h-24",
                    isSelected
                      ? `${role.border} bg-[#1f1345] shadow-[0_0_15px_rgba(105,56,196,0.4)]`
                      : "border-transparent bg-[#1a1136] hover:bg-[#231745]"
                  )}
                >
                  <Icon className={cn("h-6 w-6", isSelected ? role.color : "text-white/40")} />
                  <span className={cn("text-sm font-semibold", isSelected ? "text-white" : "text-white/60")}>{role.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <UserRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                        <Input 
                          className="pl-12 bg-[#1a1136] border-transparent text-white placeholder:text-white/40 h-14 rounded-xl focus-visible:ring-purple-500 focus-visible:border-purple-500 shadow-inner" 
                          placeholder="Full Name" 
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                        <Input 
                          className="pl-12 bg-[#1a1136] border-transparent text-white placeholder:text-white/40 h-14 rounded-xl focus-visible:ring-purple-500 focus-visible:border-purple-500 shadow-inner" 
                          placeholder="Yourname@company.com" 
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
                          placeholder="Password (min 8 chars)" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full h-14 bg-gradient-to-r from-[#6938c4] to-[#4261b5] hover:opacity-90 transition-opacity rounded-xl text-lg font-semibold shadow-lg shadow-purple-900/50 text-white" disabled={signupMutation.isPending}>
              {signupMutation.isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              Create {selectedRole === "admin" ? "Admin" : "Member"} Account
            </Button>
            
            <p className="mt-8 text-xs text-white/40 font-medium pt-4 text-center">
              Already have an account? <Link href="/login" className="text-purple-500 hover:underline">Sign in</Link>
            </p>
          </form>
        </Form>
      </div>
    </AuthLayout>
  );
}
