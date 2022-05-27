import { SMTPClient } from 'emailjs';
import { MaiTemplateService } from './mail-template';

export class SendMailService {
    static async sendMail(name: any, email: any,verifyCode: any, content: any, callback: any){
        const client: any = new SMTPClient({
            user: `${process.env.MAIL}`,
            password: `${process.env.MAIL_PASSWORD}`,
            host: `${process.env.MAIL_HOST}`,
            ssl: true,
        });
        try {
            await MaiTemplateService.getMailTemplate({name, email,verifyCode, content},'en',async (data: any)=>{
                const nameCompany = `Lemon <${process.env.COMPANYMAIL}>`
                await client.sendAsync({
                    text: data.thankyou_customer.content,
                    from: nameCompany,
                    to: email,
                    subject:data.thankyou_customer.subject,
                    attachment: [
                        { data: data.thankyou_customer.content, alternative: true },
                        
                    ],
                });
                callback()
            })
        }
        catch (e) {
            callback("error", e)
        }

    }

    static async sendMailForgotPassword(email: any,code: any,pass:any, callback: any){
        const client: any = new SMTPClient({
            user: process.env.MAIL,
            password: process.env.MAIL_PASSWORD,
            host: process.env.MAIL_HOST,
            ssl: true,
        });
        try {
            await MaiTemplateService.getMailTemplateForgotPassword({email,code, pass},'en',async (data: any)=>{
                const nameCompany = `Lemon <${process.env.COMPANYMAIL}>`
                await client.sendAsync({
                    text: data.forgotPassword.content,
                    from: nameCompany,
                    to: email,
                    subject:data.forgotPassword.subject,
                    attachment: [
                        { data: data.forgotPassword.content, alternative: true },
                        
                    ],
                });
                callback()
            })
        }
        catch (e) {
            callback("error", e)
        }

    }
}
