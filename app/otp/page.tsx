"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { useOtpForm } from "@/features/auth/hooks/useAuthForms";
import { useVerifyOtp } from "@/shared/hooks/useVerifyOtp";
import { useResendOtp } from "@/shared/hooks/useResendOtp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import type { OtpValues } from "@/features/auth/schemas/auth.schema";
import { toast } from "sonner";
import { Logo } from "@/shared/components/Logo";
import { cn } from "@/lib/utils";

function OtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";
  const countryId = searchParams.get("country_id") || "";

  const verifyMutation = useVerifyOtp();
  const resendMutation = useResendOtp();
  const otpForm = useOtpForm();

  const [resendTimer, setResendTimer] = React.useState(60);
  const [canResend, setCanResend] = React.useState(false);

  // Timer logic for resending OTP
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0 && !canResend) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [resendTimer, canResend]);

  // Redirect back if no phone is found in the context
  if (!phone || !countryId) {
    router.replace("/auth");
    return null;
  }

  const onOtpSubmit = async (values: OtpValues) => {
    verifyMutation.mutate(
      { phone, code: values.otp, country_id: countryId },
      {
        onSuccess: (response) => {
          if (response.status) {
            toast.success(response.message || "تم التحقق بنجاح");
          } else {
            toast.error(response.message || "رمز التحقق غير صحيح");
          }
        },
        onError: (error: unknown) => {
          const msg =
            error instanceof Error
              ? error.message
              : "حدث خطأ أثناء التحقق، يرجى المحاولة لاحقاً";
          toast.error(msg);
        },
      },
    );
  };

  const handleResendOtp = () => {
    if (!canResend) return;

    resendMutation.mutate(
      { phone, country_id: countryId },
      {
        onSuccess: (response) => {
          if (response.status) {
            toast.success(response.message || "تم إرسال الرمز الجديد");
            setResendTimer(60);
            setCanResend(false);
          } else {
            toast.error(response.message || "فشل إرسال الرمز");
          }
        },
        onError: (error: Error) => {
          toast.error(error?.message || "فشل إرسال الرمز، حاول مجدداً");
        },
      },
    );
  };

  const isPending = verifyMutation.isPending || resendMutation.isPending;

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

        <div className="w-full mobile-auth-card p-8 flex flex-col gap-8 min-h-[400px]">
          <div className="flex flex-col items-center text-center gap-2">
            <h1 className="text-[28px] font-bold text-[#3B5897] tracking-tight">
              التحقق
            </h1>
            <p className="text-[14px] text-muted-foreground font-normal">
              تم إرسال رمز التفعيل إلى <span className="font-bold" dir="ltr">{phone}</span>
            </p>
          </div>

          {verifyMutation.isSuccess ? (
            <div className="flex flex-col items-center gap-6 py-6 animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <div className="text-center">
                <p className="font-bold text-[20px] text-[#3B5897] mb-1">تم التحقق بنجاح</p>
                <p className="text-[14px] text-muted-foreground font-medium">جاري تحويلك للمنصة...</p>
              </div>
            </div>
          ) : (
            <Form {...otpForm}>
              <form
                onSubmit={otpForm.handleSubmit(onOtpSubmit)}
                className="flex flex-col gap-8"
              >
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center gap-4">
                      <FormControl>
                        <div dir="ltr" className="flex justify-center w-full">
                          <InputOTP
                            maxLength={4}
                            disabled={isPending}
                            {...field}
                            containerClassName="justify-center gap-3"
                          >
                            <InputOTPGroup className="gap-3">
                              {[0, 1, 2, 3].map((index) => (
                                <InputOTPSlot
                                  key={index}
                                  index={index}
                                  className="w-[64px] h-[64px] text-[24px] font-bold rounded-[16px] border-none bg-[#F3F4F6] text-[#3B5897] focus-visible:ring-2 focus-visible:ring-[#3B5897] transition-all"
                                />
                              ))}
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs font-medium text-red-500 text-center" />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-6">
                  <Button
                    type="submit"
                    className={cn(
                      "w-full h-[56px] rounded-[16px] font-bold text-[18px] transition-all active:scale-95",
                      otpForm.watch("otp")?.length === 4 
                        ? "bg-[#3B5897] text-white shadow-[0_15px_30px_-5px_rgba(59,88,151,0.25)]" 
                        : "bg-[#F3F4F6] text-gray-400 cursor-not-allowed shadow-none"
                    )}
                    disabled={isPending || otpForm.watch("otp")?.length !== 4}
                  >
                    {verifyMutation.isPending ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      "تأكيد"
                    )}
                  </Button>

                  <div className="flex flex-col items-center gap-4">
                    {!canResend ? (
                      <p className="text-[14px] text-gray-400 font-medium">
                        إعادة الإرسال بعد <span className="font-bold">{resendTimer}</span> ثانية
                      </p>
                    ) : (
                      <button
                        type="button"
                        className="text-[14px] text-[#3B5897] font-bold hover:underline disabled:opacity-50"
                        onClick={handleResendOtp}
                        disabled={resendMutation.isPending}
                      >
                        {resendMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin inline-block ml-2" />
                        ) : "إعادة إرسال الرمز"}
                      </button>
                    )}

                    <button
                      type="button"
                      className="text-[14px] text-[#3B5897] font-medium opacity-60 hover:opacity-100 hover:underline transition-all"
                      onClick={() => router.replace("/auth")}
                      disabled={isPending}
                    >
                      تغيير رقم الهاتف
                    </button>
                  </div>
                </div>
              </form>
            </Form>
          )}
        </div>

        {/* Footer Links (Shared from Login) */}
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

export default function OtpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="animate-spin" />
        </div>
      }
    >
      <OtpContent />
    </Suspense>
  );
}
