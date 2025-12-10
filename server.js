const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statische Dateien servieren
app.use(express.static(path.join(__dirname, 'public')));

// SMTP Transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_ENCRYPTION === 'ssl',
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
    }
});

// Kontaktformular Endpoint
app.post('/api/contact', async (req, res) => {
    const { name, email, phone, subject, message } = req.body;

    // Validierung
    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: 'Bitte alle Pflichtfelder ausfüllen.'
        });
    }

    // E-Mail Inhalt
    const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_ADDRESS}>`,
        to: process.env.CONTACT_EMAIL || 'mkarwowska@interia.eu',
        replyTo: email,
        subject: `Neue Kontaktanfrage: ${subject || 'Allgemeine Anfrage'}`,
        html: `
            <h2>Neue Kontaktanfrage von der Website</h2>
            <table style="border-collapse: collapse; width: 100%;">
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Name:</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${name}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>E-Mail:</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;"><a href="mailto:${email}">${email}</a></td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Telefon:</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${phone || 'Nicht angegeben'}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Temat:</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${subject || 'Allgemeine Anfrage'}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Wiadomość:</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${message.replace(/\n/g, '<br>')}</td>
                </tr>
            </table>
            <p style="margin-top: 20px; color: #666; font-size: 12px;">
                Diese Nachricht wurde über das Kontaktformular auf morafi.pl gesendet.
            </p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({
            success: true,
            message: 'Dziękujemy za wiadomość! Odpowiemy najszybciej jak to możliwe.'
        });
    } catch (error) {
        console.error('E-Mail Fehler:', error);
        res.status(500).json({
            success: false,
            message: 'Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie później.'
        });
    }
});

// Alle anderen Routen zur index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});
