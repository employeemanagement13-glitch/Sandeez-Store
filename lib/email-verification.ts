import { resolveMx } from 'dns/promises';

/**
 * Validates email format and verifies domain existance via MX records.
 * This is a robust server-side check to ensure the email is semi-legit.
 */
export async function verifyEmail(email: string): Promise<{
    isValid: boolean;
    error?: string;
    details?: any;
}> {
    // 1. Basic Regex check
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
        return { isValid: false, error: 'Invalid email format' };
    }

    const domain = email.split('@')[1];

    try {
        // 2. DNS MX Record check
        // This verifies if the domain actually has mail servers configured.
        const mxRecords = await resolveMx(domain);

        if (!mxRecords || mxRecords.length === 0) {
            return { isValid: false, error: 'Email domain has no valid mail servers (MX records)' };
        }

        // 3. Google Specific Hint
        // If it's a gmail address, ensure it's pointing to Google's servers
        if (domain.toLowerCase() === 'gmail.com') {
            const isGoogle = mxRecords.some(r => r.exchange.toLowerCase().includes('google.com') || r.exchange.toLowerCase().includes('googlemail.com'));
            if (!isGoogle) {
                return { isValid: false, error: 'Potentially spoofed Gmail domain' };
            }
        }

        return {
            isValid: true,
            details: {
                domain,
                mxCount: mxRecords.length,
                primaryMx: mxRecords[0].exchange
            }
        };
    } catch (error: any) {
        // If DNS lookup fails, the domain likely doesn't exist
        return {
            isValid: false,
            error: `Domain verification failed: ${error.code === 'ENOTFOUND' ? 'Domain not found' : error.message}`
        };
    }
}
