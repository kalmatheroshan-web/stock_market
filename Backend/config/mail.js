export default function mail(otp) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>OTP Verification</title>
    <style>
        /* Inline styles are preferred, but some email clients support <style> */
        body {
            margin: 0;
            padding: 0;
            background-color: #0a0807;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }
        .container {
            max-width: 480px;
            margin: 0 auto;
            padding: 40px 20px;
            background: linear-gradient(145deg, #1a1410 0%, #0d0b0a 100%);
            border-radius: 24px;
            border: 1px solid rgba(255, 140, 0, 0.15);
            box-shadow: 0 20px 60px rgba(0,0,0,0.8), 0 0 80px rgba(255, 140, 0, 0.05);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid rgba(255, 140, 0, 0.1);
        }
        .logo {
            display: inline-block;
            font-size: 22px;
            font-weight: 800;
            background: linear-gradient(135deg, #fb923c, #f97316);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: -0.5px;
        }
        .otp-box {
            background: rgba(255, 140, 0, 0.06);
            border: 1px solid rgba(255, 140, 0, 0.25);
            border-radius: 16px;
            padding: 24px 20px;
            margin: 30px 0;
            text-align: center;
        }
        .otp-code {
            font-size: 40px;
            font-weight: 700;
            letter-spacing: 12px;
            color: #fb923c;
            text-shadow: 0 0 30px rgba(255, 140, 0, 0.15);
            font-family: 'Courier New', monospace;
        }
        .subtitle {
            color: rgba(255, 200, 160, 0.5);
            font-size: 14px;
            line-height: 1.6;
            text-align: center;
            margin: 20px 0 10px;
        }
        .expiry {
            color: rgba(255, 200, 160, 0.35);
            font-size: 12px;
            text-align: center;
            margin-top: 10px;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 140, 0, 0.08);
            text-align: center;
            color: rgba(255, 200, 160, 0.25);
            font-size: 12px;
        }
        .footer a {
            color: #fb923c;
            text-decoration: none;
        }
        /* Fallback for email clients that don't support gradient text */
        .logo-fallback {
            color: #fb923c;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <span class="logo">TradePro</span>
        </div>

        <!-- Main Content -->
        <div style="text-align:center; margin-top:10px;">
            <h2 style="font-size:24px; font-weight:600; color:#f5e6d3; margin:0 0 8px;">
                Verify Your Email
            </h2>
            <p style="color:rgba(255,200,160,0.5); font-size:15px; margin:0;">
                Enter the following code to complete your sign‑up:
            </p>
        </div>

        <!-- OTP Box -->
        <div class="otp-box">
            <div class="otp-code">${otp}</div>
            <div style="color:rgba(255,200,160,0.3); font-size:13px; margin-top:8px;">
                This code expires in 60 seconds
            </div>
        </div>

        <!-- Additional Info -->
        <p class="subtitle">
            If you didn't request this, please ignore this email.
        </p>

        <!-- Footer -->
        <div class="footer">
            <p style="margin:0 0 4px;">&copy; 2024 TradePro. All rights reserved.</p>
            <p style="margin:0;">
                <a href="#">Privacy Policy</a> &bull; <a href="#">Terms of Service</a>
            </p>
        </div>
    </div>
</body>
</html>`;
}