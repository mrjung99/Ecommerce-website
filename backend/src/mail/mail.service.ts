import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Resend } from "resend";


@Injectable()
export class MailService{
   private  resend: Resend;
   private readonly logger = new Logger(MailService.name)
   private readonly fromEmail:string

   constructor(private readonly configService:ConfigService){
      const apiKey = this.configService.get<string>('RESEND_EMAIL_API')
      this.fromEmail = this.configService.get<string>('RESEND_FROM_EMAIL') || ''

      if (!apiKey) {
         this.logger.error('Resend api key is not configured in environment variable.')
      }

      this.resend = new Resend(apiKey)
      this.logger.log('Resend email service initialized.')
   }

   async sendPasswordReset(to:string, resetUrl:string):Promise<void>{
      try {
         const {data,error} = await this.resend.emails.send({
            from:this.fromEmail,
            to:[to],
            subject: 'Reset your password - Saja store',
            html: this.getPasswordResetHtml(resetUrl),
            text: this.getPasswordResetText(resetUrl)
         })
      } catch (error) {
         
      }
   }

   private getPasswordResetHtml(resetUrl:string):string{
      return  `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f5;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 2px solid #f0f0f0;
          }
          .header h1 {
            color: #3b82f6;
            margin: 0;
            font-size: 28px;
          }
          .content {
            padding: 30px 20px;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #3b82f6;
            color: white !important;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: 600;
          }
          .button:hover {
            background-color: #2563eb;
          }
          .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #6b7280;
            border-top: 1px solid #f0f0f0;
          }
          .warning {
            background-color: #fef3c7;
            padding: 12px;
            border-radius: 6px;
            margin: 20px 0;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>We received a request to reset your password for your E-commerce App account.</p>
            <p>Click the button below to create a new password:</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p><code style="word-break: break-all; color: #3b82f6;">${resetUrl}</code></p>
            <div class="warning">
              ⚠️ This link will expire in <strong>10 minutes</strong> for security reasons.
            </div>
            <p>If you didn't request this, please ignore this email or contact support.</p>
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply.</p>
            <p>&copy; 2024 E-commerce App. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
   }

   private getPasswordResetText(resetUrl: string): string {
    return `
      Password Reset Request
      
      Hello,
      
      We received a request to reset your password for your E-commerce App account.
      
      Click this link to reset your password:
      ${resetUrl}
      
      This link will expire in 10 minutes for security reasons.
      
      If you didn't request this, please ignore this email.
      
      ---
      This is an automated message, please do not reply.
    `;
  }

    private getWelcomeText(name: string): string {
    return `Welcome ${name}! Thank you for joining our E-commerce platform.`;
  }

}