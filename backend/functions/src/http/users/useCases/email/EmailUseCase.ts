import { AuthRepository } from '@repositories/AuthRepository.js';
import { singleton } from 'tsyringe';
import nodemailer from 'nodemailer';

@singleton()
export class EmailUseCase {
  constructor(private _auth: AuthRepository) {}

  async execute(email: string, url: string): Promise<void> {
    const user = await this._auth.getUserByEmail(email);
    const name = user.displayName;

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const transport = nodemailer.createTransport({
      service: 'gmail',
      host: 'stmp.gmail.com',
      port: 465,
      secure: false,
      auth: {
        user: 'contato.codeshop@gmail.com',
        pass: 'ovla pcvu rbad ucyb'
      }
    });

    const mailOptions = {
      from: 'contato.codeshop@gmail.com',
      to: email,
      subject: 'Recuperação de Senha - CodeShop',
      html: `
<p>Prezado(a) ${name},</p>

<p>Esperamos que você esteja bem!</p>

<p>Recebemos uma solicitação para redefinir a sua senha na CodeShop. Caso você não tenha feito essa solicitação, por favor, ignore este e-mail. Caso contrário, siga as instruções abaixo para recuperar sua senha:</p>

<p><a href="${url}">Clique no link a seguir para iniciar o processo de redefinição de senha</a></p>

<p>Você será redirecionado para uma página onde poderá criar uma nova senha. Após redefinir sua senha, você poderá acessar sua conta com as novas credenciais.</p>

<p>Por motivos de segurança, este link é válido por apenas 24 horas. Caso o link expire, você precisará solicitar uma nova recuperação de senha.</p>

<p>Se tiver qualquer dúvida ou encontrar dificuldades durante o processo, nossa equipe de suporte está à disposição para ajudá-lo. Entre em contato conosco pelo e-mail suporte@codeshop.com ou pelo telefone (XX) XXXX-XXXX.</p>

<p>Agradecemos pela confiança em nossos serviços.</p>

<p>Atenciosamente,<br>
Equipe CodeShop</p>

<p>Este e-mail foi enviado automaticamente. Por favor, não responda a este e-mail.</p>

<p>CodeShop - Sua loja de códigos</p>
`
    };
    await transport.sendMail(mailOptions);
  }
}
