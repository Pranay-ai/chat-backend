import { Injectable } from "@nestjs/common";
import * as sgMail from '@sendgrid/mail';



@Injectable()
export class EmailService {
    constructor() {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
    }

    async sendEmail(to: string, subject: string, html: string): Promise<void> {
        const msg = {
            to: to,
            from: process.env.SENDGRID_FROM_EMAIL as string,
            subject: subject,
            html: html,
        };

        try {
            await sgMail.send(msg);
        } catch (error) {
            console.error("Error sending email:", error.response?.body || error.message);
            throw new Error("Failed to send email");
        }
    }
}
