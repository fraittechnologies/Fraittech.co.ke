# Quick Start Guide - Email Forms

## ⚡ 5-Minute Setup

### Step 1: Edit config.php
```bash
Open: config.php
Update lines 8-10:
- SMTP_USERNAME: your-email@gmail.com
- SMTP_PASSWORD: your-16-char-app-password
```

### Step 2: Get Gmail App Password
1. Go to https://myaccount.google.com/security
2. Find "App passwords" (requires 2FA enabled)
3. Select Mail → Your Device
4. Copy 16-character password
5. Paste into config.php

### Step 3: Test
1. Open contact.html or quotation.html in browser
2. Fill out form
3. Click Submit
4. Check inbox for emails

## 📧 Email Recipients

| Form | Sends To |
|------|----------|
| Contact | info@fraittechnologies.co.ke |
| Quotation | info@fraittechnologies.co.ke |
| Both | + Confirmation to user |

## 🔧 Configuration Quick Reference

```php
// config.php - Key Settings

MAIL_FROM_EMAIL = 'info@fraittechnologies.co.ke'  // Receive emails here
MAIL_FROM_NAME = 'Frait Technologies'            // Company name
SMTP_HOST = 'smtp.gmail.com'                     // Gmail (or Outlook, etc)
SMTP_PORT = 587                                  // Standard TLS port
SMTP_USERNAME = '*** YOUR EMAIL ***'             // Update this
SMTP_PASSWORD = '*** YOUR APP PASSWORD ***'      // Update this

DEBUG_MODE = false                               // Set true for debugging
```

## 📝 What Each File Does

| File | Purpose |
|------|---------|
| **config.php** | Stores email credentials & settings |
| **contact-handler.php** | Processes contact form → sends emails |
| **quotation-handler.php** | Processes quotation form → sends emails |
| **contact.html** | Contact form (updated with handler) |
| **quotation.html** | Quotation form (updated with handler) |
| **PHPMailer/** | Email library (already included) |

## ✅ Verification Checklist

After setup, verify:
- [ ] config.php has been updated with credentials
- [ ] Contact form can be submitted
- [ ] Email arrives at info@fraittechnologies.co.ke
- [ ] Confirmation email arrives at user
- [ ] Quotation form can be submitted
- [ ] All emails are formatted nicely

## 🚨 Common Issues & Fixes

| Problem | Solution |
|---------|----------|
| "Failed to send" | Check SMTP credentials in config.php |
| "Connection timeout" | Verify SMTP_HOST and SMTP_PORT |
| "Invalid password" | Use 16-char App Password (not regular password) |
| Email in spam | Check sender reputation, domain SPF/DKIM |

## 📞 Email Features

**Contact Form Sends:**
- Email to company with: Name, Email, Subject, Message
- Confirmation to user: "Thank you for contacting us"

**Quotation Form Sends:**
- Email to company with: Client info, Service, Budget, Timeline, Description
- Confirmation to user: Project summary with timeline

## 🔐 Security

✅ Passwords in separate config.php file
✅ HTTPS recommended (not enforced)
✅ Form validation on server & client
✅ Email address verification
❌ CAPTCHA not included (add if needed)

## 📚 More Information

- Full guide: [EMAIL_SETUP_GUIDE.md](EMAIL_SETUP_GUIDE.md)
- Implementation details: [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
- Gmail App Passwords: https://support.google.com/accounts/answer/185833

---

**Status**: Ready to use after SMTP configuration
**Email**: info@fraittechnologies.co.ke
