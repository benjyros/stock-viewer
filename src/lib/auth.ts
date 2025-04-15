import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
 
const prisma = new PrismaClient();
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {  
        enabled: true,
        requireEmailVerification: false
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        // sendVerificationEmail: async ( { user, token }, request) => {
        //     const verificationUrl = `${process.env.BETTER_AUTH_URL}/api/auth/verify-email?token=${token}&callbackURL=${process.env.EMAIL_VERIFICATION_CALLBACK_URL}`;
        //   await sendEmail({
        //     to: user.email,
        //     subject: "Verify your email address",
        //     text: `Click the link to verify your email: ${verificationUrl}`,
        //   });
        // },
      },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60 // Cache duration in seconds
        }
    }
});

export type Session = typeof auth.$Infer.Session;
