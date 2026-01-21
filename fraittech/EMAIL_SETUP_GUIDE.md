# Email Form Setup Guide - Frait Technologies

This guide explains how to set up and configure the email forms for your website using PHPMailer.

## Files Created

1. **config.php** - Configuration file for email credentials
2. **contact-handler.php** - Handler for the contact form
3. **quotation-handler.php** - Handler for the quotation form
4. **contact.html** - Updated contact form with form handling
5. **quotation.html** - Updated quotation form with form handling

## Configuration Steps

### Step 1: Update Email Credentials in config.php

Edit the `config.php` file and update the following settings:

```php
// Email to send inquiries to
define('MAIL_FROM_EMAIL', 'info@fraittechnologies.co.ke');
define('MAIL_FROM_NAME', 'Frait Technologies');

// SMTP Configuration (Gmail example - see alternatives below)
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USERNAME', 'your-email@gmail.com');        // Update this
define('SMTP_PASSWORD', 'your-app-password');           // Update this
```

### Step 2: Gmail Setup (Recommended)

If using Gmail:

1. Enable 2-Factor Authentication on your Google Account
2. Generate an App Password:
   - Go to https://myaccount.google.com/
   - Select "Security" from the left menu
   - Scroll down to "App passwords"
   - Select "Mail" and "Windows Computer" (or your device type)
   - Copy the 16-character password
   - Paste it as `SMTP_PASSWORD` in config.php

### Step 3: Alternative Email Providers

**Outlook/Hotmail:**
```php
define('SMTP_HOST', 'smtp-mail.outlook.com');
define('SMTP_PORT', 587);
define('SMTP_USERNAME', 'your-email@outlook.com');
define('SMTP_PASSWORD', 'your-password');
```

**Custom SMTP Server:**
```php
define('SMTP_HOST', 'your-mail-server.com');
define('SMTP_PORT', 587);  // or 465 for SSL
define('SMTP_USERNAME', 'your-username');
define('SMTP_PASSWORD', 'your-password');
```

## How It Works

### Contact Form
- **Location**: contact.html
- **Handler**: contact-handler.php
- **Fields**: Name, Email, Subject, Message
- **Features**:
  - Sends email to info@fraittechnologies.co.ke
  - Sends confirmation email to user
  - Validates all fields
  - Returns JSON response for AJAX handling

### Quotation Form
- **Location**: quotation.html
- **Handler**: quotation-handler.php
- **Fields**: Client Name, Email, Phone, Company, Service Type, Project Description, Budget Range, Timeline
- **Features**:
  - Sends detailed quotation request to company email
  - Sends confirmation email to client
  - Pre-fills service type and price when opened
  - Validates required fields
  - Returns JSON response for AJAX handling

## Email Features

Both forms include:

✓ **HTML Email Templates** - Professional formatted emails
✓ **Confirmation Emails** - Automatic response to users
✓ **Form Validation** - Server-side and client-side validation
✓ **Error Handling** - Comprehensive error management
✓ **Debug Mode** - Set `DEBUG_MODE` to `true` in config.php for development
✓ **Character Encoding** - UTF-8 support for international characters

## Testing

To test the forms:

1. Fill out either contact or quotation form
2. Submit the form
3. Check that:
   - Email is received at info@fraittechnologies.co.ke
   - Confirmation email is received by the user
   - Success message appears on the website

## Troubleshooting

### "Unable to send email" Error
- Check SMTP credentials are correct
- Verify email account credentials with your email provider
- Ensure 2-Factor Authentication is set up (for Gmail)
- Check that SMTP_PASSWORD is an App Password, not your regular password

### "Connection timeout" Error
- Verify SMTP_HOST is correct
- Check SMTP_PORT matches your email provider
- Ensure firewall allows outgoing connections on port 587 or 465

### Emails not received
- Check spam/junk folder
- Verify email address is correct
- Check email server logs (if DEBUG_MODE is enabled)
- Ensure domain reputation is good (no blacklisting)

### Debug Mode
To enable detailed error logging, in config.php:
```php
define('DEBUG_MODE', true);
```
Errors will appear in browser console and PHP error logs.

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never commit config.php to public repositories** - It contains passwords
2. **Use App Passwords** - Not your main email password
3. **Store passwords securely** - Consider using environment variables in production
4. **Enable HTTPS** - Forms should only work over secure connections
5. **Validate email addresses** - Both server-side (already done) and client-side
6. **Rate limiting** - Consider adding CAPTCHA for production use

### Production Recommendations

For production environments:

```php
// Use environment variables instead
define('SMTP_USERNAME', getenv('SMTP_USERNAME'));
define('SMTP_PASSWORD', getenv('SMTP_PASSWORD'));

// Disable debug mode
define('DEBUG_MODE', false);

// Add CAPTCHA verification
// Add rate limiting
// Add email validation services
```

## Customization

### Change Email Recipient
Edit `config.php`:
```php
define('MAIL_FROM_EMAIL', 'your-new-email@domain.com');
```

### Change Email Subject Line
Edit `contact-handler.php` or `quotation-handler.php`:
```php
$mail->Subject = 'Your Custom Subject Here';
```

### Add More Fields
1. Add input in HTML form
2. Add validation in PHP handler
3. Add field to email body

## File Structure

```
/
├── config.php                  # Email configuration
├── contact-handler.php         # Contact form processor
├── quotation-handler.php       # Quotation form processor
├── contact.html                # Contact page
├── quotation.html              # Quotation page
└── PHPMailer/                  # PHPMailer library (already included)
    └── src/
        ├── PHPMailer.php
        ├── SMTP.php
        └── Exception.php
```

## Support

For issues with:
- **PHPMailer**: Visit https://github.com/PHPMailer/PHPMailer
- **SMTP Configuration**: Contact your email provider's support
- **Form Implementation**: Review the JavaScript in contact.html and quotation.html

## License

This implementation uses PHPMailer which is licensed under the LGPL 2.1 license.
See PHPMailer/LICENSE for details.

---

**Last Updated**: January 2026
**Email Address**: info@fraittechnologies.co.ke
