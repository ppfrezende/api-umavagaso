import nodemailer from 'nodemailer';
import { env } from '@/env';

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

class MailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    if (env.NODE_ENV !== 'test') {
      this.createTransporter();
    }
  }

  private createTransporter() {
    if (env.SMTP_USER && env.SMTP_PASS) {
      this.transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: false,
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
      });
    } else {
      console.warn(
        'SMTP credentials not configured. Email sending will be disabled.',
      );
    }
  }

  async sendEmail({ to, subject, html }: SendEmailOptions) {
    if (!this.transporter) {
      return { messageId: 'mock-message-id' };
    }

    try {
      const info = await this.transporter.sendMail({
        from: env.SMTP_FROM,
        to,
        subject,
        html,
      });

      console.log('Message sent: %s', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendVerificationEmail(to: string, name: string, token: string) {
    const html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verificação de Email</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(to right, #4F46E5, #7C3AED); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">Uma Vaga Só</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #4F46E5; margin-top: 0;">Olá, ${name}!</h2>
          <p>Obrigado por se registrar na plataforma Uma Vaga Só.</p>
          <p>Para completar seu cadastro, por favor copie e cole o seguinte código:</p>
          <p><strong>Seu código de verificação:</strong> <code style="background: #e5e7eb; padding: 5px 10px; border-radius: 3px; font-size: 16px;">${token}</code></p>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">Este código expira em 24 horas.</p>
          <p style="color: #666; font-size: 14px;">Se você não criou uma conta, por favor ignore este email.</p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
          <p>© 2025 Uma Vaga Só. Todos os direitos reservados.</p>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to,
      subject: 'Verificação de Email - Uma Vaga Só',
      html,
    });
  }
}

export const mailService = new MailService();
