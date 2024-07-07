"use server";

import { createTransport } from "nodemailer";

const transporter = createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export async function sendMail({
  to,
  subject,
  content,
}: {
  to: string;
  subject: string;
  content: string;
}) {
  transporter.sendMail({
    from: '"Owlcase🦉" <sukronsabari11@gmail.com>',
    to,
    subject,
    html: content,
  });
}

// export async function sendActivationMail(email: string, token: string) {
//   renderFile(
//     path.resolve(process.cwd(), "templates/account-activation.ejs"),
//     {
//       activationLink: `${process.env.CLIENT_HOST}:${process.env.CLIENT_PORT}/auth/activate-account?token=${token}`,
//     },
//     async (err, template) => {
//       await sendMail({
//         to:
//           process.env.NODE_ENV !== "production"
//             ? "skrnsabary27@gmail.com"
//             : email,
//         subject: "Account Activation",
//         content: template,
//       });
//     }
//   );
// }
