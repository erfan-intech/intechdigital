# SMTP Setup Instructions for IntechDigital Contact Form

## Step 1: Download PHPMailer

PHPMailer is required for reliable SMTP email sending. You have two options:

### Option A: Download PHPMailer Manually (Recommended for XAMPP)

1. Download PHPMailer from: https://github.com/PHPMailer/PHPMailer/releases
2. Extract the ZIP file
3. Copy the `PHPMailer` folder to your project root (same level as `contact.php`)
4. Your folder structure should look like:
   ```
   intechdigital/
   ├── PHPMailer/
   │   ├── src/
   │   │   ├── PHPMailer.php
   │   │   ├── SMTP.php
   │   │   └── Exception.php
   │   └── ...
   ├── contact.php
   ├── smtp_config.php
   └── ...
   ```

### Option B: Use Composer (If you have Composer installed)

Run in your project root:
```bash
composer require phpmailer/phpmailer
```

## Step 2: Configure SMTP Settings

1. Open `smtp_config.php`
2. Fill in your SMTP details:
   - **smtp_host**: Your SMTP server (e.g., `smtp.gmail.com`)
   - **smtp_port**: Port number (usually 587 for TLS, 465 for SSL)
   - **smtp_encryption**: `tls` or `ssl`
   - **smtp_username**: Your email address
   - **smtp_password**: Your email password or app password
   - **from_email**: The sender email address
   - **to_email**: Already set to `erfan.intech@gmail.com`

## Step 3: Gmail Setup (If using Gmail)

If you're using Gmail, you need to:

1. Enable 2-Step Verification on your Google account
2. Generate an App Password:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the 16-character app password
   - Use this app password in `smtp_config.php` (not your regular Gmail password)

## Step 4: Test the Form

1. Make sure XAMPP/Apache is running
2. Open your website: `http://localhost/intechdigital/index.html`
3. Fill out and submit the contact form
4. Check `erfan.intech@gmail.com` for the email

## Troubleshooting

- **"Class 'PHPMailer\PHPMailer\PHPMailer' not found"**: Make sure PHPMailer is downloaded and in the correct location
- **"SMTP connect() failed"**: Check your SMTP host, port, and credentials
- **"Authentication failed"**: Verify your username and password (use app password for Gmail)
- **"Connection timeout"**: Check if your firewall or hosting provider allows SMTP connections

## Security Note

**IMPORTANT**: Never commit `smtp_config.php` with real credentials to public repositories. Add it to `.gitignore` if using Git.

