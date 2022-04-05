import { SMTPClient } from 'emailjs';
import { MaiTemplateService } from './mail-template';

export class SendMailService {
    static async sendMail(name: any, email: any, content: any, callback: any){
        const client: any = new SMTPClient({
            user: process.env.MAIL,
            password: process.env.MAIL_PASSWORD,
            host: process.env.MAIL_HOST,
            ssl: true,
        });
        try {
            await MaiTemplateService.getMailTemplate({name, email, content},'en',async (data: any)=>{
                const nameCompany = `Lemon <${process.env.COMPANYMAIL}>`
                await client.sendAsync({
                    text: data.thankyou_customer.content,
                    from: nameCompany,
                    to: email,
                    subject:data.thankyou_customer.subject,
                    attachment: [
                        { data: data.thankyou_customer.content, alternative: true },
                        // {
                        //     path: 'src/images/logo-GAC.png', 
                        //     type:'image/png',
                        //     headers: { 'Content-ID': '<logo>' },
                        // },
                        // {
                        //     path: 'src/images/picture.png', 
                        //     type:'image/png',
                        //     headers: { 'Content-ID': '<picture>' },
                        // },
                        
                    ],
                });
    
                await client.sendAsync({
                    text: data.staff.content,
                    from: `${name} <${process.env.MAIL}>`,
                    to: process.env.MAIL,
                    subject: data.staff.subject,
                    attachment: [
                        { data: data.staff.content, alternative: true },
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
