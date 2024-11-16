import { transporter } from "../config/nodemailer";

interface IEMail {
    email: string;
    name: string;
    token: string;
}

export class AuthEmail {
    static sendConfirmationEmail = async (user: IEMail) => {
        await transporter.sendMail({
            from: 'Organizely <admin@Organizely.com>',
            to: user.email,
            subject: 'Organizely - Confirma tu cuenta',
            text: 'Organizely - Confirma tu cuenta',
            html: `<p>Hola: ${user.name} -  Has creado tu cuenta en Organizely. Solo debes confirmar tu cuenta para finalizar</p>
            <p>Visita el siguiente enlace</p>
            <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar cuentaa</a>
            <p>E ingresa el código: <b>${user.token}</b></p>
            <p>Este token expira en 10 minutos</p>
            `
        });
    }

    static sendPasswordResetToken = async (user: IEMail) => {
        await transporter.sendMail({
            from: 'Organizely <admin@Organizely.com>',
            to: user.email,
            subject: 'Organizely - Reestablece tu contraseña',
            text: 'Organizely - Reestablece tu contraseña',
            html: `<p>Hola: ${user.name} - Has solicitado reestablecer tu contraseña</p>
            <p>Visita el siguiente enlace</p>
            <a href="${process.env.FRONTEND_URL}/auth/new-password">Reestablecer contraseña</a>
            <p>E ingresa el código: <b>${user.token}</b></p>
            <p>Este token expira en 10 minutos</p>
            `
        });
    }
}

