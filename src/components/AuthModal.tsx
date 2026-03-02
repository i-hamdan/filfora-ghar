"use client";

import { useState } from "react";
import { X, Phone, ShieldCheck, User as UserIcon, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { supabase } from "@/lib/supabase";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
    const [step, setStep] = useState<"phone" | "otp" | "name">("phone");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const { setUser } = useAuthStore();

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (phone.length < 10) {
            setError("Please enter a valid 10-digit number");
            return;
        }
        setError("");
        setIsLoading(true);

        try {
            const { data, error: fnError } = await supabase.functions.invoke('send-whatsapp-otp', {
                body: { phone: `+91${phone}` }
            });
            if (fnError) throw fnError;
            if (data?.error) throw new Error(data.error);

            setStep("otp");
        } catch (err: any) {
            setError(err.message || "Failed to send OTP. Try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length < 4) {
            setError("Please enter a valid OTP");
            return;
        }
        setError("");
        setIsLoading(true);

        try {
            const fullPhone = `+91${phone}`;
            const { data, error: fnError } = await supabase.functions.invoke('verify-whatsapp-otp', {
                body: { phone: fullPhone, otp, name: "" }
            });

            if (fnError) {
                // Handle case where function returns a non-2xx status code directly
                const errorData = await fnError.context?.json?.().catch(() => null);
                throw new Error(errorData?.error || "OTP verification failed. Please try again.");
            }
            if (data?.error) throw new Error(data.error);

            const authEmail = `91${phone}@filforaghar.com`;
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: authEmail,
                password: "FilforaWhatsAppAuth2026!",
            });

            if (signInError) throw signInError;

            const { data: profile } = await supabase.from('profiles').select('*').eq('phone', fullPhone).single();
            if (profile) {
                setUser(profile as any);
                if (!profile.full_name || profile.full_name === "Guest Customer") {
                    setStep("name");
                } else {
                    if (onSuccess) onSuccess();
                    handleClose();
                }
            } else {
                setStep("name");
            }
        } catch (err: any) {
            setError(err.message || "Invalid OTP or session failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveName = async (e: React.FormEvent) => {
        e.preventDefault();
        if (name.length < 3) {
            setError("Please enter your full name");
            return;
        }
        setError("");
        setIsLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase.from('profiles').update({ full_name: name }).eq('id', user.id);
                setUser({ id: user.id, phone: `+91${phone}`, full_name: name });
            }
            if (onSuccess) onSuccess();
            handleClose();
        } catch (err: any) {
            setError("Failed to save profile name.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setStep("phone");
        setPhone("");
        setOtp("");
        setName("");
        setError("");
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
                    />
                    <div className="fixed inset-0 z-[111] flex items-end sm:items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "100%", opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-[2rem] p-6 sm:p-8 pointer-events-auto relative shadow-2xl border border-zinc-100 dark:border-zinc-800"
                        >
                            <button
                                onClick={handleClose}
                                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors bg-zinc-100 dark:bg-zinc-800 rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="mb-8 mt-2">
                                <h2 className="text-2xl font-bold title-font mb-2">
                                    {step === "phone" && "Log in or sign up"}
                                    {step === "otp" && "Verify your number"}
                                    {step === "name" && "What's your name?"}
                                </h2>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                    {step === "phone" && "We'll send a WhatsApp OTP to verify your identity."}
                                    {step === "otp" && `Enter the code sent to +91 ${phone}`}
                                    {step === "name" && "Just a few details to serve you better."}
                                </p>
                            </div>

                            {step === "phone" && (
                                <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">+91</span>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                                            placeholder="10-digit mobile number"
                                            className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:border-primary focus:bg-white dark:focus:bg-zinc-900 outline-none rounded-2xl py-4 pl-14 pr-4 transition-all text-lg font-medium tracking-wide"
                                            autoFocus
                                        />
                                    </div>
                                    {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                                    <button
                                        disabled={isLoading || phone.length < 10}
                                        className="w-full bg-primary hover:bg-primary-dark text-white rounded-2xl py-4 font-bold text-lg disabled:opacity-50 transition-all flex justify-center items-center shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 mt-2"
                                    >
                                        {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Continue with WhatsApp"}
                                    </button>
                                </form>
                            )}

                            {step === "otp" && (
                                <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                        placeholder="Enter OTP"
                                        className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:border-primary focus:bg-white dark:focus:bg-zinc-900 outline-none rounded-2xl py-4 px-4 transition-all text-center text-2xl tracking-[0.5em] font-bold"
                                        autoFocus
                                    />
                                    {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                                    <button
                                        disabled={isLoading || otp.length < 4}
                                        className="w-full bg-primary hover:bg-primary-dark text-white rounded-2xl py-4 font-bold text-lg disabled:opacity-50 transition-all flex justify-center items-center shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 mt-2"
                                    >
                                        {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Verify & Continue"}
                                    </button>
                                    <button type="button" onClick={() => setStep("phone")} className="text-sm font-medium text-zinc-500 hover:text-primary mt-2">
                                        Change Phone Number
                                    </button>
                                </form>
                            )}

                            {step === "name" && (
                                <form onSubmit={handleSaveName} className="flex flex-col gap-4">
                                    <div className="relative">
                                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="e.g. Asif Rasheed"
                                            className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:border-primary focus:bg-white dark:focus:bg-zinc-900 outline-none rounded-2xl py-4 pl-12 pr-4 transition-all text-lg font-medium"
                                            autoFocus
                                        />
                                    </div>
                                    {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                                    <button
                                        disabled={isLoading || name.length < 3}
                                        className="w-full bg-primary hover:bg-primary-dark text-white rounded-2xl py-4 font-bold text-lg disabled:opacity-50 transition-all flex justify-center items-center shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 mt-2"
                                    >
                                        {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Save & Finish"}
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
