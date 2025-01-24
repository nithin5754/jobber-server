





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


 verify_email_2:({username,verificationLink}:{username: string, verificationLink: string}):string => {

  
  const htmlTemplate:string = `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
      <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');
          
          body {
              margin: 0;
              padding: 0;
              font-family: 'Inter', sans-serif;
              background-color: #f5f5f5;
          }
          
          .email-container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 40px;
              border-radius: 10px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          
          .logo {
              text-align: center;
              margin-bottom: 30px;
          }
          
          .logo img {
              max-width: 150px;
              height: auto;
          }
          
          .content {
              color: #333333;
              line-height: 1.6;
          }
          
          .welcome-text {
              font-size: 24px;
              font-weight: 600;
              margin-bottom: 20px;
              color: #1a1a1a;
          }
          
          .verification-button {
              display: inline-block;
              background-color: #4F46E5;
              color: #ffffff !important;
              text-decoration: none;
              padding: 12px 30px;
              border-radius: 6px;
              margin: 25px 0;
              font-weight: 600;
              text-align: center;
              transition: background-color 0.3s ease;
          }
          
          .verification-button:hover {
              background-color: #4338CA;
          }
          
          .alternative-link {
              color: #6B7280;
              font-size: 14px;
              margin-top: 20px;
          }
          
          .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              text-align: center;
              color: #6B7280;
              font-size: 14px;
          }
          
          .social-links {
              margin: 20px 0;
          }
          
          .social-links a {
              margin: 0 10px;
              color: #6B7280;
              text-decoration: none;
          }
          
          @media only screen and (max-width: 600px) {
              .email-container {
                  padding: 20px;
              }
              
              .welcome-text {
                  font-size: 20px;
              }
          }
      </style>
  </head>
  <body>
      <div class="email-container">
          <div class="logo">
              <!-- Replace with your company logo -->
              <img src="https://your-company-logo.com/logo.png" alt="Company Logo">
          </div>
          
          <div class="content">
              <div class="welcome-text">Welcome to Our Platform, ${username}! 👋</div>
              
              <p>Thank you for joining us! We're excited to have you on board. To get started, please verify your email address by clicking the button below:</p>
              
              <a href="${verificationLink}" class="verification-button">
                  Verify Email Address
              </a>
              
              <p class="alternative-link">
                  If the button doesn't work, copy and paste this link into your browser:<br>
                  <a href="${verificationLink}">
                      Verify Email
                  </a>
              </p>
              
              <p>This verification link will expire in 24 hours for security reasons. If you didn't create an account with us, please ignore this email.</p>
              
              <div class="footer">
                  <div class="social-links">
                      <a href="#">Twitter</a> |
                      <a href="#">Facebook</a> |
                      <a href="#">LinkedIn</a>
                  </div>
                  <p>© 2024 Your Company Name. All rights reserved.</p>
                  <p>123 Company Street, City, Country</p>
              </div>
          </div>
      </div>
  </body>
  </html>
  `;


  return htmlTemplate
 
}  ,


verify_email_otp:({ username, otpCode }: { username: string, otpCode: string }): string => {
  
    const htmlTemplate: string = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');
            
            body {
                margin: 0;
                padding: 0;
                font-family: 'Inter', sans-serif;
                background-color: #f5f5f5;
            }
            
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            
            .logo {
                text-align: center;
                margin-bottom: 30px;
            }
            
            .logo img {
                max-width: 150px;
                height: auto;
            }
            
            .content {
                color: #333333;
                line-height: 1.6;
            }
            
            .welcome-text {
                font-size: 24px;
                font-weight: 600;
                margin-bottom: 20px;
                color: #1a1a1a;
            }
            
            .otp-code {
                display: inline-block;
                background-color: #4F46E5;
                color: #ffffff;
                font-size: 28px;
                font-weight: bold;
                padding: 10px 20px;
                border-radius: 6px;
                margin: 25px 0;
                text-align: center;
                letter-spacing: 5px;
            }
            
            .alternative-text {
                color: #6B7280;
                font-size: 14px;
                margin-top: 20px;
            }
            
            .footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                text-align: center;
                color: #6B7280;
                font-size: 14px;
            }
            
            .social-links {
                margin: 20px 0;
            }
            
            .social-links a {
                margin: 0 10px;
                color: #6B7280;
                text-decoration: none;
            }
            
            @media only screen and (max-width: 600px) {
                .email-container {
                    padding: 20px;
                }
                
                .welcome-text {
                    font-size: 20px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="logo">
                <!-- Replace with your company logo -->
                <img src="https://your-company-logo.com/logo.png" alt="Company Logo">
            </div>
            
            <div class="content">
                <div class="welcome-text">Hello, ${username}!</div>
                
                <p>To verify your email address, please use the OTP code below:</p>
                
                <div class="otp-code">${otpCode}</div>
                
                <p class="alternative-text">
                    This OTP code will expire in 15 minutes. If you did not request this, please ignore this email.
                </p>
                
                <div class="footer">
                    <div class="social-links">
                        <a href="#">Twitter</a> |
                        <a href="#">Facebook</a> |
                        <a href="#">LinkedIn</a>
                    </div>
                    <p>© 2024 Your Company Name. All rights reserved.</p>
                    <p>123 Company Street, City, Country</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
  
    return htmlTemplate;
  }
  




};

export type MailType = typeof EmailTemplate;

export { EmailTemplate };
