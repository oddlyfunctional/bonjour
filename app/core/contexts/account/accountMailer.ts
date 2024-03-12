import { Mailer } from "@/app/lib/mailer";
import { Config } from "@/app/core/config";

export type AccountMailer = {
  sendAccountVerificationEmail: (params: {
    email: string;
    token: string;
  }) => Promise<void>;
};

export const make = (config: Config, mailer: Mailer): AccountMailer => ({
  sendAccountVerificationEmail: ({
    email,
    token,
  }: {
    email: string;
    token: string;
  }) =>
    mailer.sendTemplate({
      to: [email],
      from: config.mailer.noReplyAddress,
      subject: "Verify your Bonjour account",
      template: config.mailer.accountVerificationTemplate,
      params: { token },
    }),
});
