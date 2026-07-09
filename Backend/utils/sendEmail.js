export default async function sendEmail(email, subject, otp, html = "", text = "") {
    const data = {
        sender: { name: 'Fikri Shop', email: "kalmatheroshan@gmail.com" },
        to: [{ email }],
        subject,
        htmlContent: html || text || mail(otp)
    };

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'api-key': process.env.BREVO_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(`Brevo API error: ${response.status} - ${JSON.stringify(errorBody)}`);
        }

        const result = await response.json();
        console.log("Email sent to", email);
        return result;
    } catch (err) {
        console.error("API Error:", err.message);
        throw err;
    }
}