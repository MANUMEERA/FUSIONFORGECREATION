<?php
/**
 * Fusion Forge Creation - Hostinger SMTP Email Configuration (Optional)
 * 
 * To enable direct authenticated SMTP delivery via Hostinger:
 * 1. Copy this file to `email-config.php` in the same directory (`public/api/` or `dist/api/`).
 * 2. Set your Hostinger webmail password below.
 * 3. Never commit `email-config.php` to public git repositories.
 */

return [
    'host' => 'smtp.hostinger.com',
    'port' => 465,
    'secure' => 'ssl', // 'ssl' for port 465, or 'tls' for port 587
    'user' => 'admin@fusionforgecreation.com',
    'pass' => 'YOUR_HOSTINGER_EMAIL_PASSWORD_HERE'
];
