# GitHub & Vercel Setup Guide

## Step 1: Initialize Git Repository

Open PowerShell/Terminal in your project folder and run:

```bash
git init
```

## Step 2: Add All Files

```bash
git add .
```

## Step 3: Create Initial Commit

```bash
git commit -m "Initial commit: IntechDigital website"
```

## Step 4: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon → **"New repository"**
3. Repository name: `intechdigital-website` (or any name you prefer)
4. Choose **Public** or **Private**
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click **"Create repository"**

## Step 5: Connect Local Repository to GitHub

GitHub will show you commands. Use these (replace `YOUR_USERNAME` with your GitHub username):

```bash
git remote add origin https://github.com/YOUR_USERNAME/intechdigital-website.git
git branch -M main
git push -u origin main
```

## Step 6: Deploy to Vercel

### 6.1 Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub

### 6.2 Import Project

1. Click **"Add New Project"**
2. Import your GitHub repository
3. Vercel will auto-detect settings

### 6.3 Configure Environment Variables

In Vercel project settings, go to **"Environment Variables"** and add:

```
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_ENCRYPTION = tls
SMTP_AUTH = true
SMTP_USERNAME = erfan.intech@gmail.com
SMTP_PASSWORD = nnblssprjkuhbovk
FROM_EMAIL = erfan.intech@gmail.com
FROM_NAME = IntechDigital Website
TO_EMAIL = erfan.intech@gmail.com
REPLY_TO_EMAIL = info@intechdigital.xyz
REPLY_TO_NAME = IntechDigital Support
```

### 6.4 Deploy

1. Click **"Deploy"**
2. Vercel will:
   - Install Composer dependencies (PHPMailer)
   - Build and deploy your site
3. Your site will be live at: `https://your-project.vercel.app`

## Important Notes

✅ **What gets committed to GitHub:**
- All website files (HTML, CSS, JS)
- `contact.php` (email handler)
- `composer.json` (dependencies)
- `vercel.json` (Vercel config)
- `.gitignore` (protects sensitive files)

❌ **What does NOT get committed:**
- `smtp_config.php` (contains credentials - protected by .gitignore)
- `vendor/` folder (installed by Composer on Vercel)

🔒 **Security:**
- Your Gmail app password is stored in Vercel environment variables (secure)
- Never commit `smtp_config.php` to GitHub

## Troubleshooting

**If git push fails:**
- Make sure you're logged into GitHub
- Check your repository URL is correct

**If Vercel deployment fails:**
- Check that all environment variables are set
- Check Vercel logs for errors
- Make sure `composer.json` is committed

**If emails don't work on Vercel:**
- Verify all environment variables are set correctly
- Check Vercel function logs
- Test SMTP credentials locally first

## Next Steps After Deployment

1. Update your domain (if you have one) in Vercel settings
2. Test the contact form on the live site
3. Check email delivery

---

**Need help?** Check Vercel documentation: https://vercel.com/docs

