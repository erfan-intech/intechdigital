const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method not allowed' });
    return;
  }

  // Get and sanitize form data
  const { name, email, organization, interest, message } = req.body;

  // Validation
  const errors = [];
  if (!name || !name.trim()) {
    errors.push('Name is required');
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Valid email is required');
  }

  if (errors.length > 0) {
    res.status(400).json({ success: false, message: errors.join(', ') });
    return;
  }

  // Map interest values to readable text
  const interestMap = {
    'school-portal': 'School Management Portal',
    'shop-system': 'Shop Management System',
    'both': 'Both solutions',
    'other': 'Other software solutions'
  };
  const interestText = interestMap[interest] || interest || 'Not specified';

  // Get SMTP configuration from environment variables
  const smtpConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_ENCRYPTION === 'ssl',
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD
    }
  };

  // Validate SMTP config
  if (!smtpConfig.auth.user || !smtpConfig.auth.pass) {
    res.status(500).json({
      success: false,
      message: 'Email service not configured. Please contact us directly at info@intechdigital.xyz'
    });
    return;
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.secure,
    auth: smtpConfig.auth
  });

  // Email content
  const emailSubject = 'New Contact Form Submission - IntechDigital Website';
  const emailBody = `New contact form submission from IntechDigital website

Name: ${name.trim()}
Email: ${email.trim()}
Organization: ${organization ? organization.trim() : 'Not provided'}
Interest: ${interestText}
Message:
${message ? message.trim() : 'No message provided'}

---
Submitted on: ${new Date().toISOString()}
IP Address: ${req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'Unknown'}
`;

  try {
    // Send email
    await transporter.sendMail({
      from: `"${process.env.FROM_NAME || 'IntechDigital Website'}" <${process.env.FROM_EMAIL || process.env.SMTP_USERNAME}>`,
      to: process.env.TO_EMAIL || 'erfan.intech@gmail.com',
      replyTo: `${name.trim()} <${email.trim()}>`,
      subject: emailSubject,
      text: emailBody
    });

    res.status(200).json({
      success: true,
      message: 'Thank you for your message. We will get back to you soon!'
    });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({
      success: false,
      message: 'Sorry, there was an error sending your message. Please try again later or contact us directly at info@intechdigital.xyz'
    });
  }
};

