"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { usePhoneForm } from "@/features/auth/hooks/useAuthForms";
import { MobilePhoneInput } from "@/shared/components/MobilePhoneInput";
import { useLogin } from "@/shared/hooks/useLogin";
import type { PhoneValues } from "@/features/auth/schemas/auth.schema";
import { toast } from "sonner";
import { Logo } from "@/shared/components/Logo";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginMutation = useLogin();

  const phoneForm = usePhoneForm();

  const onPhoneSubmit = async (values: PhoneValues) => {
    loginMutation.mutate(values, {
      onSuccess: (response) => {
        if (response.status) {
          toast.success(response.message || "تم إرسال رمز التحقق");
          // Carry callbackUrl through to the OTP page so we can redirect back after login
          const callbackUrl =
            searchParams.get("callbackUrl") || "/quick-start?mode=edit";
          const params = new URLSearchParams({
            phone: values.phone,
            country_id: values.country_id.toString(),
            callbackUrl,
          });
          router.push(`/otp?${params.toString()}`);
        } else {
          toast.error(response.message || "فشل إرسال الرمز");
        }
      },
      onError: (error: Error) => {
        toast.error(error?.message || "حدث خطأ ما، يرجى المحاولة لاحقاً");
      },
    });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-vignette p-6"
      dir="rtl"
    >
      <div className="w-full max-w-[430px] flex flex-col items-center gap-8">
        {/* Logo Section */}
        <Logo
          width={130}
          height={130}
          showText={false}
          imageClassName="w-[130px] h-[130px] rounded-[30px]"
        />

        <div className="w-full mobile-auth-card p-8 flex flex-col gap-8">
          <div className="flex flex-col items-center text-center gap-2">
            <h1 className="text-[28px] font-bold text-[#3B5897] tracking-tight">
              تسجيل الدخول
            </h1>
            <p className="text-[14px] text-muted-foreground font-normal">
              أهلاً بك في منصة 80road العقارية
            </p>
          </div>

          <Form {...phoneForm}>
            <form
              onSubmit={phoneForm.handleSubmit(onPhoneSubmit)}
              className="flex flex-col gap-8"
            >
              <FormField
                control={phoneForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-[12px] font-[900] text-gray-500 block text-right">
                      رقم الهاتف
                    </FormLabel>
                    <FormControl>
                      <MobilePhoneInput
                        placeholder="00000000"
                        {...field}
                        onCountryChange={(id) =>
                          phoneForm.setValue("country_id", id, {
                            shouldValidate: true,
                          })
                        }
                        defaultCountry="KW"
                        disabled={loginMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-medium text-red-500" />
                  </FormItem>
                )}
              />
              
              <Button
                type="submit"
                className="w-full h-[56px] rounded-[16px] bg-[#3B5897] hover:bg-[#3B5897]/90 text-white font-bold text-[18px] shadow-[0_15px_30px_-5px_rgba(59,88,151,0.25)] transition-all active:scale-95"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  "إرسال رمز التفعيل"
                )}
              </Button>
            </form>
          </Form>
        </div>

        {/* Footer Links */}
        <div className="text-center px-4 leading-[1.8]">
           <p className="text-[12px] text-gray-400 font-medium">
             بتسجيل الدخول فإنك توافق على{" "}
             <button onClick={() => router.push('/terms')} className="text-[#3B5897] hover:underline">الشروط والأحكام</button>
             {" "}و{" "}
             <button onClick={() => router.push('/privacy')} className="text-[#3B5897] hover:underline">سياسة الخصوصية</button>
           </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="animate-spin" />
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  );
}
