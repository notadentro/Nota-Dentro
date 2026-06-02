import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { personalizedLessonRecommendations } from '@/ai/flows/personalized-lesson-recommendations';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, whatsapp, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Configurar o transportador do Nodemailer com Zoho SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.zoho.com',
      port: 465,
      secure: true, // true para port 465
      auth: {
        user: process.env.SMTP_USER, // ex: contato@notadentro.com
        pass: process.env.SMTP_PASS, // Senha de Aplicativo
      },
    });

    // Definir para qual email a mensagem será enviada
    const toEmail = subject === 'suporte' 
      ? 'suporte@notadentro.com' 
      : 'contato@notadentro.com';

    // Disparar o e-mail
    await transporter.sendMail({
      from: `"${name}" <${process.env.SMTP_USER}>`, // Zoho exige que o remetente seja a própria conta autenticada
      replyTo: email, // Quando responder, vai para o e-mail do usuário
      to: toEmail,
      subject: `[NotaDentro Form] Nova mensagem de ${name}`,
      text: `Nome: ${name}\nEmail: ${email}\nWhatsApp: ${whatsapp || 'Não informado'}\nAssunto: ${subject}\n\nMensagem:\n${message}`,
    });

    res.status(200).json({ success: true, message: 'Contato enviado com sucesso' });
  } catch (error) {
    console.error('Erro ao enviar contato:', error);
    res.status(500).json({ error: 'Erro interno ao enviar e-mail' });
  }
});

app.post('/api/recommendations', async (req, res) => {
  try {
    const input = req.body;
    const recommendations = await personalizedLessonRecommendations(input);
    res.json(recommendations);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
