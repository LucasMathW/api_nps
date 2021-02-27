import nodemailer, {Transporter} from 'nodemailer';
import { resolve } from 'path';
import handlebars from 'handlebars';
import fs from 'fs';

class SendMailService {
  private client: Transporter;
  constructor(){
    nodemailer.createTestAccount().then(account=>{
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
            user: account.user,
            pass: account.pass
        }
    });
      this.client = transporter; 
    })
  }
  
  async execute(to: string, subject: string, body: string) {
    const npsPath = resolve(__dirname, "..", "views", "emails", "npsmail.hbs");
    const templateFiteContent = fs.readFileSync(npsPath).toString('utf8');

    const mailTemplateParse = handlebars.compile(templateFiteContent);

    const html = mailTemplateParse({
      name: to,
      title: subject,
      description: "NPS <noreplay@email.com.br>"
    })
    
    const message = await this.client.sendMail({
      to,
      subject,
      html: body,
      from: 'NPS <noreplay@nps.com.br>'
    })

    console.log('Message sent: %s', message.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));

  }
}

export default new SendMailService(); 