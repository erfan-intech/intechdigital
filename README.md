# IntechDigital Website

Modern, responsive company website for IntechDigital - Software & Solutions.

## Features

- 🎨 Modern, responsive design
- 📧 Contact form with SMTP email integration
- 🔒 Secure form handling
- 📱 Mobile-friendly interface

## Products

- **School Management Portal** - Complete digital solution for educational institutions
- **Shop Management System** - Smart inventory and sales management

## Local Development

### Prerequisites

- XAMPP (or any PHP server)
- PHP 7.4 or higher

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   composer install
   ```
3. Configure SMTP (for local development):
   - Copy `smtp_config.php.example` to `smtp_config.php` (if exists)
   - Or create `smtp_config.php` with your SMTP settings
   - See `README_SMTP_SETUP.md` for detailed instructions

4. Start your local server:
   - XAMPP: Place in `htdocs` folder
   - Or use PHP built-in server: `php -S localhost:8000`

5. Open in browser: `http://localhost/intechdigital/index.html`

## Deployment on Vercel

### Setup

1. Push code to GitHub
2. Connect your GitHub repository to Vercel
3. Configure Environment Variables in Vercel dashboard:

   **Required Environment Variables:**
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_ENCRYPTION=tls
   SMTP_AUTH=true
   SMTP_USERNAME=erfan.intech@gmail.com
   SMTP_PASSWORD=your-app-password
   FROM_EMAIL=erfan.intech@gmail.com
   FROM_NAME=IntechDigital Website
   TO_EMAIL=erfan.intech@gmail.com
   REPLY_TO_EMAIL=info@intechdigital.xyz
   REPLY_TO_NAME=IntechDigital Support
   ```

4. Vercel will automatically:
   - Install Composer dependencies
   - Deploy your site

### Vercel Configuration

Create `vercel.json` in project root (optional, for custom routing):

```json
{
  "version": 2,
  "builds": [
    {
      "src": "**/*.php",
      "use": "@vercel/php"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

## Contact

- **Email**: info@intechdigital.xyz
- **Phone**: +88 01405-833-038
- **Facebook**: [facebook.com/IntechDigital.dev](https://facebook.com/IntechDigital.dev)

## License

© 2024 IntechDigital. All rights reserved.

