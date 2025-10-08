import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./server/db";
import * as schema from "$lib/server/db/schema";
// import { Resend } from "resend";
// import { env } from "$env/dynamic/private";

// const resend = new Resend(env.RESEND_API_KEY);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
});

/*
emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: "DraftBox <noreply@mtg.jbursik.dev>",
        to: user.email,
        subject: "Verify your email",
        html: `<a href="${url}">Click here to verify</a>`,
      });
    },
  },
*/
