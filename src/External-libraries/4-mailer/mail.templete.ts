





const EmailTemplate = {
  verify_email: ({username,verificationLink}:{username: string, verificationLink: string}): string => {
    let template: string = `<div style="font-family: Arial, sans-serif; color: #333; padding: 20px; max-width: 600px; margin: auto;">
    <h1 style="color: #4CAF50;">Hi ${username}</h1>
    <p style="font-size: 16px;">
      Thank you for registering. Please verify your email by clicking the link below.
    </p>
    <div style="margin: 20px 0; text-align: center;">
      <a href="${verificationLink}" 
         style="background-color: #4CAF50; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
        Verify Email
      </a>
    </div>
    <p style="font-size: 14px; color: #666;">
      If you did not request this, please ignore this email.
    </p>
  </div>`;
    return template;
  },
};

export type MailType = typeof EmailTemplate;

export { EmailTemplate };
