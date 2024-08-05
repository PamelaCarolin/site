const nodemailer = require('nodemailer');

exports.handler = async function(event, context) {
    const data = JSON.parse(event.body);
    const { company_name, date } = data;

    // Configuração do transportador de e-mail
    const transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        auth: {
            user: process.env.EMAIL_USER,  // Use variáveis de ambiente para segurança
            pass: process.env.EMAIL_PASS   // Use variáveis de ambiente para segurança
        }
    });

    // Configuração do e-mail
    const mailOptions = {
        from: process.env.EMAIL_USER, // Usando a variável de ambiente
        to: 'pamela.silva@contabilmultipla.com.br', // O e-mail de destino correto
        subject: 'Dados do Formulário',
        text: `Nome da Empresa: ${company_name}\nData: ${date}`
    };

    try {
        await transporter.sendMail(mailOptions);
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true })
        };
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false })
        };
    }
};
