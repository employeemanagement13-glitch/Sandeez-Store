import { SignIn } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center p-4">
      {/* Optional: Add your logo/branding */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
        <p className="text-gray-400">Sign in to your account to continue</p>
      </div>

      <div className="w-full max-w-md">
        <SignIn
          appearance={{
            baseTheme: dark, // Start with Clerk's dark theme as base
            elements: {
              // Main container styling
              card: "bg-gray-900/90 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-2xl",
              
              // Header
              headerTitle: "text-white font-bold text-2xl",
              headerSubtitle: "text-gray-400",
              
              // Form fields
              formFieldLabel: "text-gray-300 font-medium",
              formFieldInput: "bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200",
              formFieldInputShowPasswordButton: "text-gray-400 hover:text-white",
              
              // Buttons
              formButtonPrimary: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-[1.02]",
              formButtonReset: "text-gray-400 hover:text-white transition-colors",
              
              // Social buttons
              socialButtonsBlockButton: "bg-gray-800 border-gray-700 text-white hover:bg-gray-700 transition-all duration-200",
              socialButtonsBlockButtonText: "text-gray-300 font-medium",
              socialButtonsBlockButtonArrow: "text-gray-400",
              
              // Footer links
              footerActionText: "text-gray-400",
              footerActionLink: "text-blue-400 hover:text-blue-300 font-medium transition-colors",
              
              // Divider
              dividerLine: "bg-gray-800",
              dividerText: "text-gray-500",
              
              // Form text
              formHeaderTitle: "text-white",
              formHeaderSubtitle: "text-gray-400",
              
              // Alternative methods
              alternativeMethodsBlockButton: "text-gray-400 hover:text-white border-gray-800 hover:border-gray-700",
              
              // Error/success messages
              identityPreviewText: "text-white",
              identityPreviewEditButton: "text-blue-400 hover:text-blue-300",
              formFieldSuccessText: "text-green-400",
              formFieldErrorText: "text-red-400",
              
              // OTP input
              otpCodeFieldInput: "bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
            },
            variables: {
              colorPrimary: "#3b82f6", // blue-500
              colorText: "#ffffff",
              colorTextSecondary: "#9ca3af", // gray-400
              colorTextOnPrimaryBackground: "#ffffff",
              colorBackground: "#111827", // gray-900
              colorInputBackground: "#1f2937", // gray-800
              colorInputText: "#ffffff",
            },
            layout: {
              socialButtonsPlacement: "bottom", // or "top" based on preference
              socialButtonsVariant: "blockButton", // or "iconButton"
              logoPlacement: "inside", // or "none"
            }
          }}
          routing="path"
          path="/sign-in"
          redirectUrl="/dashboard"
          signUpUrl="/sign-up"
        />
      </div>
      
      {/* Optional: Additional footer */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
      </div>
    </div>
  );
}
