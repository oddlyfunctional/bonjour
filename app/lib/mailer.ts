type Email = {
  to: Array<string>;
  from: string;
  subject: string;
  template: string;
  params: Record<string, string>;
};

export type Mailer = {
  sendTemplate: (email: Email) => Promise<void>;
};

export const dryRun: Mailer = {
  sendTemplate: async (email) => console.log(email),
};

export const mock = () => {
  let lastEmail: Email | null = null;
  let getLastEmail = () => lastEmail;
  const mailer: Mailer = {
    sendTemplate: async (email) => {
      lastEmail = email;
    },
  };

  return { getLastEmail, mailer };
};
