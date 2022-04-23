require('dotenv').config();

import { createTransport, SendMailOptions } from 'nodemailer';
console.log(process.env.NODE_ENV);

const transporter = createTransport({
  host: process.env.SMTP_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendMail = async (options: SendMailOptions) => {
  try {
    options.from = process.env.SMTP_USER;
    const result = await transporter.sendMail(options);
    console.error(
      '------------------- [[ SEND MAIL RESULT START ]] -------------------\n',
      result,
      '\n-------------------- [[ SEND MAIL RESULT END ]] ------------------- ',
    );
  } catch (err) {
    console.error(
      '------------------- [[ SEND MAIL ERROR START ]] -------------------\n',
      err,
      '\n-------------------- [[ SEND MAIL ERROR END ]] ------------------- ',
    );
  }
};

export { sendMail };
