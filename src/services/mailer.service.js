// src/services/mailer.service.js
import { mailTransport } from '../config/mail.config.js';

export const sendRecoveryEmail = async (to, subject, htmlContent) => {
  const result = await mailTransport.sendMail({
    from: `"Soporte Farmacia TELMAR"` + ` <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: htmlContent
  });

  return result;
};
