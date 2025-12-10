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
            message: 'Proszę wypełnić wszystkie wymagane pola.'
        });
    }

    // Temat-Übersetzung
    const subjectMap = {
        'ksiegowosc': 'Księgowość',
        'kadry': 'Kadry i płace',
        'podatki': 'Doradztwo podatkowe',
        'wycena': 'Wycena usług',
        'inne': 'Inne'
    };
    const subjectText = subjectMap[subject] || subject || 'Zapytanie ogólne';

    // E-Mail Inhalt
    const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_ADDRESS}>`,
        to: process.env.CONTACT_EMAIL || 'mkarwowska@interia.eu',
        replyTo: email,
        subject: `Nowe zapytanie ze strony: ${subjectText}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #1a365d 0%, #2c5282 100%); padding: 30px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Morafi</h1>
                        <p style="color: #c9a227; margin: 5px 0 0; font-size: 14px;">Biuro Rachunkowe</p>
                    </div>

                    <!-- Content -->
                    <div style="padding: 30px;">
                        <h2 style="color: #1a365d; margin-top: 0; border-bottom: 2px solid #c9a227; padding-bottom: 10px;">
                            Nowe zapytanie ze strony internetowej
                        </h2>

                        <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0;">
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #718096; width: 140px;">
                                        <strong>Imię i nazwisko:</strong>
                                    </td>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #2d3748;">
                                        ${name}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #718096;">
                                        <strong>Adres e-mail:</strong>
                                    </td>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #2d3748;">
                                        <a href="mailto:${email}" style="color: #1a365d;">${email}</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #718096;">
                                        <strong>Numer telefonu:</strong>
                                    </td>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #2d3748;">
                                        ${phone ? `<a href="tel:${phone}" style="color: #1a365d;">${phone}</a>` : '<span style="color: #a0aec0;">Nie podano</span>'}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #718096;">
                                        <strong>Temat:</strong>
                                    </td>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #2d3748;">
                                        ${subjectText}
                                    </td>
                                </tr>
                            </table>
                        </div>

                        <div style="margin-top: 25px;">
                            <h3 style="color: #1a365d; margin-bottom: 10px; font-size: 16px;">Treść wiadomości:</h3>
                            <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-left: 4px solid #c9a227; padding: 15px; border-radius: 4px; color: #4a5568; line-height: 1.6;">
                                ${message.replace(/\n/g, '<br>')}
                            </div>
                        </div>

                        <!-- Quick Reply Button -->
                        <div style="margin-top: 30px; text-align: center;">
                            <a href="mailto:${email}?subject=Re: ${subjectText}"
                               style="display: inline-block; background-color: #c9a227; color: #1a365d; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                                Odpowiedz na wiadomość
                            </a>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div style="background-color: #1a365d; padding: 20px; text-align: center;">
                        <p style="color: #a0aec0; margin: 0; font-size: 12px;">
                            Ta wiadomość została wysłana automatycznie z formularza kontaktowego na stronie morafi.pl
                        </p>
                        <p style="color: #718096; margin: 10px 0 0; font-size: 11px;">
                            © ${new Date().getFullYear()} Morafi - Biuro Rachunkowe Monika Karwowska
                        </p>
                    </div>
                </div>
            </body>
            </html>
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
