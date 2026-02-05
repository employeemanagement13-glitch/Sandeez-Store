import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function Page() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <SignUp
                    appearance={{
                        baseTheme: dark, // Use the built-in dark theme
                        variables: {
                            colorPrimary: "#3b82f6",
                            colorBackground: "#000000",
                            colorText: "#ffffff",
                            colorTextSecondary: "#a3a3a3",
                            colorInputBackground: "#000000",
                            colorInputText: "#ffffff",
                            borderRadius: "0.5rem",
                            colorDanger: "#ef4444",
                            colorSuccess: "#10b981",
                            colorWarning: "#f59e0b",
                        },
                        elements: {
                            // Main container
                            rootBox: "mx-auto",
                            card: "",
                            cardBox: "",
                            
                            // Header
                            headerTitle: "text-white font-bold text-2xl",
                            headerSubtitle: "text-neutral-400 text-sm mt-2",
                            
                            // Form fields
                            formFieldLabel: "text-white font-medium text-sm mb-2",
                            formFieldInput: "bg-black border border-neutral-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-neutral-700",
                            formFieldInputGroup: "space-y-4",
                            
                            // Buttons
                            formButtonPrimary: "w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95",
                            formButtonReset: "text-neutral-400 hover:text-white transition-colors text-sm",
                            
                            // Social buttons
                            socialButtonsBlockButton: "bg-black border border-neutral-800 text-white hover:bg-neutral-900 hover:border-neutral-700 transition-all duration-200 rounded-lg",
                            socialButtonsBlockButtonText: "text-neutral-200 font-medium",
                            socialButtonsBlockButtonArrow: "text-neutral-500",
                            socialButtonsIconButton: "border border-neutral-800 hover:border-neutral-700",
                            
                            // Footer links
                            footerActionText: "text-neutral-400 text-sm",
                            footerActionLink: "text-blue-400 hover:text-blue-300 font-medium transition-colors",
                            
                            // Divider
                            dividerLine: "bg-neutral-800",
                            dividerText: "text-neutral-500 text-xs",
                            
                            // Error and success states
                            formFieldErrorText: "text-red-400 text-xs mt-1",
                            formFieldSuccessText: "text-green-400 text-xs mt-1",
                            formFieldWarningText: "text-yellow-400 text-xs mt-1",
                            
                            // OTP input
                            otpCodeFieldInput: "bg-black border border-neutral-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-md",
                            
                            // Terms and privacy
                            termsAndConditions: "bg-black/50 border border-neutral-800 rounded-lg p-4 mt-4",
                            termsAndConditionsText: "text-neutral-400 text-sm",
                            termsAndConditionsLink: "text-blue-400 hover:text-blue-300",
                            
                            // Password strength
                            formFieldRow: "space-y-1",
                            formHeaderTitle: "text-white",
                            formHeaderSubtitle: "text-neutral-400",
                            
                            // Avatar upload
                            avatarBox: "border border-neutral-800",
                            avatarImageActions: "bg-black/80",
                            uploadButton: "bg-neutral-900 hover:bg-neutral-800",
                            
                            // Alternative methods
                            alternativeMethodsBlockButton: "text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700",
                            
                            // Loading states
                            loading: "text-white",
                            spinner: "text-blue-500",
                        },
                        layout: {
                            socialButtonsPlacement: "bottom",
                            socialButtonsVariant: "blockButton",
                            logoPlacement: "inside",
                            showOptionalFields: false,
                        }
                    }}
                    routing="path"
                    path="/sign-up"
                    signInUrl="/sign-in"
                    redirectUrl="/dashboard"
                    fallbackRedirectUrl="/"
                />
                
                {/* Additional info */}
                <div className="mt-6 text-center">
                    <p className="text-neutral-500 text-sm">
                        Already have an account?{" "}
                        <a href="/sign-in" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                            Sign in
                        </a>
                    </p>
                    <p className="text-neutral-600 text-xs mt-4">
                        By signing up, you agree to our{" "}
                        <a href="/terms" className="text-neutral-400 hover:text-neutral-300">Terms</a> and{" "}
                        <a href="/privacy" className="text-neutral-400 hover:text-neutral-300">Privacy Policy</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
