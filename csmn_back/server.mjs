import express from "express";
import { Resend } from "resend";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

// Serve static files from the Vue app
app.use(express.static(path.join(__dirname, '../csmn_front/dist')));

app.post('/send-mail', async (req, res) => {
    const { name, email, phone, message } = req.body;

    try {
        const response = await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: ["contact@plongee-lille.fr"],
            subject: 'Formulaire de contact CSMN',
            text: `Nom: ${name}\nEmail: ${email}\nTéléphone: ${phone}\nMessage: ${message}`
        });

        res.status(200).json({ response });
        // if (response.status === 200) send message to user

    } catch (error) {
        console.log(error);
        res.status(400).json({ error });
    }
})

// Catch-all handler to return the frontend app for any route not handled by API
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});