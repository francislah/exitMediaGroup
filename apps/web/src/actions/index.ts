import { ActionError, defineAction } from "astro:actions";
import { z } from "astro/zod";
import { Resend } from "resend";

import {
  getConfirmationEmailHtml,
  getInternalNotificationHtml,
} from "../lib/email-templates";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

const contactInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required"),
  locale: z.enum(["fr", "en"]).optional().default("fr"),
});

export const server = {
  sendContact: defineAction({
    accept: "form",
    input: contactInputSchema,
    handler: async (input) => {
      const apiKey = import.meta.env.RESEND_API_KEY;
      const recipients = import.meta.env.CONTACT_RECIPIENTS;
      const fromEmail = import.meta.env.FROM_EMAIL;

      if (!apiKey) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Email service is not configured.",
        });
      }

      const recipientList = recipients
        ? recipients.split(",").map((e: string) => e.trim()).filter(Boolean)
        : [];

      if (recipientList.length === 0) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No contact recipients configured.",
        });
      }

      const locale = input.locale ?? "fr";

      const confirmationHtml = getConfirmationEmailHtml(locale, input.name);
      const internalHtml = getInternalNotificationHtml(
        input.name,
        input.email,
        input.message,
      );

      const { error: confirmError } = await resend.emails.send({
        from: fromEmail || "Exit Media <onboarding@resend.dev>",
        to: [input.email],
        subject: locale === "fr" ? "Merci pour votre message" : "Thank you for your message",
        html: confirmationHtml,
      });

      if (confirmError) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: confirmError.message,
        });
      }

      const { error: internalError } = await resend.emails.send({
        from: fromEmail || "Exit Media <onboarding@resend.dev>",
        to: recipientList,
        replyTo: input.email,
        subject: "New contact form submission",
        html: internalHtml,
      });

      if (internalError) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: internalError.message,
        });
      }

      return { success: true };
    },
  }),
};
