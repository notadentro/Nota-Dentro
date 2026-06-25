// eslint-disable-next-line @typescript-eslint/no-require-imports
const nodemailer = require('nodemailer');

async function test() {
  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
      user: 'contato@notadentro.com',
      pass: 'dCHJmuLRUHKT',
    },
  });

  try {
    await transporter.verify();
    console.log('✅ SMTP connection successful!');
  } catch (error) {
    console.error('❌ SMTP Error:', error);
  }
}

test();
