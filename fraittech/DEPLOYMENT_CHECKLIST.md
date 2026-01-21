# Deployment Checklist - Email Forms

## Pre-Deployment ✓

### Configuration
- [ ] Update `config.php` with SMTP credentials
- [ ] Test SMTP connection locally
- [ ] Verify email address: `info@fraittechnologies.co.ke`
- [ ] Enable 2FA on email account (Gmail/Outlook)
- [ ] Generate App Password for email account

### Form Testing
- [ ] Test Contact form locally
  - [ ] Submit complete form
  - [ ] Check company receives email
  - [ ] Check user receives confirmation
  - [ ] Verify email formatting
- [ ] Test Quotation form locally
  - [ ] Submit with all fields
  - [ ] Verify all details in email
  - [ ] Check confirmation email
  - [ ] Test pre-filled service/price

### Code Review
- [ ] Check error handling in PHP files
- [ ] Review JavaScript fetch calls
- [ ] Verify form validation
- [ ] Check email templates for typos
- [ ] Review debug mode setting

## Deployment Steps

### Step 1: Upload Files
Upload these files to your web server:
```
config.php
contact-handler.php
quotation-handler.php
contact.html (updated)
quotation.html (updated)
PHPMailer/ (directory)
```

### Step 2: Set Permissions
```bash
# Make PHP files readable/executable
chmod 755 *.php
chmod 755 contact-handler.php
chmod 755 quotation-handler.php

# config.php should be readable but not in webroot ideally
chmod 600 config.php
```

### Step 3: Configure Server
- [ ] Verify PHP version: 7.0+
- [ ] Check required PHP extensions installed
- [ ] Enable `fsockopen()` for SMTP
- [ ] Disable debug mode: `DEBUG_MODE = false`

### Step 4: Security
- [ ] Enable HTTPS/SSL on domain
- [ ] Move config.php outside webroot (if possible)
- [ ] Add `.htaccess` to prevent direct access to PHP handlers
- [ ] Review file permissions
- [ ] Set up email authentication (SPF, DKIM)

### Step 5: Testing on Server
- [ ] Test Contact form submission
- [ ] Test Quotation form submission
- [ ] Verify emails arrive within 2-3 seconds
- [ ] Check email formatting on mobile
- [ ] Verify confirmation emails

## Post-Deployment

### Monitoring
- [ ] Monitor email delivery for first 24 hours
- [ ] Check for emails in spam folder
- [ ] Monitor form submission success rate
- [ ] Review server error logs daily

### Optimization
- [ ] Add rate limiting (prevent spam)
- [ ] Consider adding CAPTCHA
- [ ] Set up email bounce handling
- [ ] Archive emails/submissions

### Maintenance
- [ ] Monitor PHPMailer for updates
- [ ] Review and rotate credentials quarterly
- [ ] Keep PHP updated
- [ ] Monitor server logs for issues

## Production Settings

### config.php - Production Mode
```php
// DISABLE DEBUG MODE
define('DEBUG_MODE', false);

// Use environment variables (recommended)
define('SMTP_USERNAME', $_ENV['SMTP_USERNAME']);
define('SMTP_PASSWORD', $_ENV['SMTP_PASSWORD']);

// Or use .env file parsing
// $dotenv = \Dotenv\Dotenv::createImmutable(__DIR__);
// $dotenv->load();
```

### .htaccess - Protect Handlers
```apache
# Prevent direct access to handler files
<Files "*.php">
    Order Allow,Deny
    Deny from all
</Files>

# Allow access to handler files only via POST
<Files "contact-handler.php">
    Order Allow,Deny
    Allow from all
</Files>

# Prevent access to config file
<Files "config.php">
    Order Allow,Deny
    Deny from all
</Files>
```

### Optional: Add CAPTCHA
```php
// In contact-handler.php and quotation-handler.php
if (empty($_POST['g-recaptcha-response'])) {
    $response['message'] = 'Please verify you are not a robot.';
    echo json_encode($response);
    exit;
}

// Verify CAPTCHA token with Google
// Add to HTML form: 
// <script src="https://www.google.com/recaptcha/api.js"></script>
// <div class="g-recaptcha" data-sitekey="YOUR_SITE_KEY"></div>
```

## Rollback Plan

If issues occur:
1. [ ] Disable forms by renaming handler files
2. [ ] Revert config.php from backup
3. [ ] Check server logs for errors
4. [ ] Verify SMTP settings
5. [ ] Test with local PHP client

## Documentation

- [ ] Share QUICK_START.md with team
- [ ] Document SMTP credentials securely
- [ ] Create contact form support guide
- [ ] Archive implementation notes

## Success Criteria

✅ Forms submit without errors
✅ Emails arrive in inbox (not spam)
✅ Confirmation emails work
✅ Response time < 3 seconds
✅ Mobile forms functional
✅ No error messages in console
✅ Server logs show no errors

---

**Deployment Date**: _______________
**Deployed By**: _______________
**Status**: [ ] Ready [ ] In Progress [ ] Deployed

## Notes
```
_________________________________________________________

_________________________________________________________

_________________________________________________________
```
