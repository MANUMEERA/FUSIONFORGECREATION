<?php
/**
 * Fusion Forge Creation - Project Scope Enquiry Mail Handler
 * Secure, standalone PHP endpoint for Hostinger Apache/LiteSpeed web hosting.
 * Supports both Authenticated Hostinger SMTP (Primary) and Enhanced PHP mail() with envelope sender (Fallback).
 */

// 1. Set Security & Response Headers
header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// Allow CORS from the official domain and local development
$allowedOrigins = [
    'https://fusionforgecreation.com',
    'https://www.fusionforgecreation.com'
];
if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
}

// Handle pre-flight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// 2. Enforce POST Method Only
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Method Not Allowed. Only POST requests are accepted.'
    ]);
    exit;
}

// 3. Read and Decode JSON Payload
$rawInput = file_get_contents('php://input');
if (empty($rawInput)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Empty request payload.'
    ]);
    exit;
}

$data = json_decode($rawInput, true);
if (json_last_error() !== JSON_ERROR_NONE || !is_array($data)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Invalid JSON payload received.'
    ]);
    exit;
}

// Support both direct payload and nested { enquiry: { ... } } payload
$enquiry = isset($data['enquiry']) && is_array($data['enquiry']) ? $data['enquiry'] : $data;

// 4. Input Sanitization Helpers
function sanitizeInput($str, $maxLength = 5000) {
    if ($str === null || $str === false) return '';
    $clean = trim((string)$str);
    // Strip non-printable control characters except standard whitespace
    $clean = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $clean);
    return mb_substr($clean, 0, $maxLength, 'UTF-8');
}

function cleanHeader($str) {
    // Header injection prevention: remove \r, \n, and URL encoded variants
    $str = str_replace(["\r", "\n", "%0a", "%0d", "%0A", "%0D"], '', (string)$str);
    return trim($str);
}

function encodeMimeSubject($subject) {
    // RFC 2047 Base64 MIME encoding for email subjects
    return '=?UTF-8?B?' . base64_encode(cleanHeader($subject)) . '?=';
}

$name = sanitizeInput($enquiry['name'] ?? '', 100);
$email = sanitizeInput($enquiry['email'] ?? '', 150);
$phone = sanitizeInput($enquiry['phone'] ?? '', 50);
$company = sanitizeInput($enquiry['company'] ?? '', 150);
$gstin = strtoupper(sanitizeInput($enquiry['gstin'] ?? '', 20));
$address = sanitizeInput($enquiry['address'] ?? '', 300);
$serviceCategory = sanitizeInput($enquiry['serviceCategory'] ?? 'Web Application Development', 100);
$budgetRange = sanitizeInput($enquiry['budgetRange'] ?? 'Flexible', 100);
$timeline = sanitizeInput($enquiry['estimatedTimeline'] ?? '3-6 Weeks', 100);
$projectDescription = sanitizeInput($enquiry['projectDescription'] ?? '', 4000);
$source = sanitizeInput($enquiry['source'] ?? 'website_form', 50);

// 5. Validate Required Fields
if (empty($name)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => 'Full Name is required.']);
    exit;
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => 'A valid official email address is required.']);
    exit;
}

if (empty($phone)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => 'Phone / WhatsApp contact number is required.']);
    exit;
}

if (empty($projectDescription)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => 'Project Scope & Requirements description is required.']);
    exit;
}

// 6. Format Category Name for Display
$categoryLabels = [
    'web_development' => 'Web Application Development',
    'mobile_app' => 'Mobile Application (iOS / Android)',
    'full_stack_enterprise' => 'Full-Stack Enterprise Suite',
    'backend_api' => 'Backend & Cloud Architecture',
    'database_solutions' => 'Database & Realtime Systems',
    'ui_ux_design' => 'UI/UX & Design Systems'
];
$categoryDisplay = $categoryLabels[$serviceCategory] ?? ucwords(str_replace(['_', '-'], ' ', $serviceCategory));

// 7. Core Agency Configuration
$officialEmail = 'admin@fusionforgecreation.com';
$officialName = 'Fusion Forge Creation';
$websiteUrl = 'https://fusionforgecreation.com';
$officialPhone = '+91 63588 55524';
$timestamp = date('d M Y, h:i A T');

// HTML Encoding for safe display in email body
$safeName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$safeEmail = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$safePhone = htmlspecialchars($phone, ENT_QUOTES, 'UTF-8');
$safeCompany = !empty($company) ? htmlspecialchars($company, ENT_QUOTES, 'UTF-8') : '<em style="color:#94a3b8;">Not specified</em>';
$safeGstin = !empty($gstin) ? htmlspecialchars($gstin, ENT_QUOTES, 'UTF-8') : '<em style="color:#94a3b8;">URP / Unregistered</em>';
$safeAddress = !empty($address) ? htmlspecialchars($address, ENT_QUOTES, 'UTF-8') : '<em style="color:#94a3b8;">Not provided</em>';
$safeCategory = htmlspecialchars($categoryDisplay, ENT_QUOTES, 'UTF-8');
$safeBudget = htmlspecialchars($budgetRange, ENT_QUOTES, 'UTF-8');
$safeTimeline = htmlspecialchars($timeline, ENT_QUOTES, 'UTF-8');
$safeDescription = nl2br(htmlspecialchars($projectDescription, ENT_QUOTES, 'UTF-8'));

// 8. Build Admin Notification Email HTML (Light Theme with Orange Accents)
$adminSubjectPlain = "New Project Scope Enquiry: {$name} [{$categoryDisplay}]";
$adminSubject = encodeMimeSubject($adminSubjectPlain);

$adminBody = <<<HTML
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>New Project Scope Enquiry</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f1f5f9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="640" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;width:100%;background-color:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;box-shadow:0 10px 25px -5px rgba(0,0,0,0.06), 0 8px 10px -6px rgba(0,0,0,0.04);">
          <!-- Header -->
          <tr>
            <td style="padding:28px 32px;background:linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);border-bottom:2px solid #fed7aa;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <div style="font-size:20px;font-weight:900;letter-spacing:1px;color:#0f172a;text-transform:uppercase;">
                      FUSION FORGE <span style="color:#ea580c;">CREATION</span>
                    </div>
                    <div style="font-size:11px;color:#c2410c;letter-spacing:2px;text-transform:uppercase;margin-top:4px;font-weight:600;">
                      Where Ideas Fuse With Technology
                    </div>
                  </td>
                  <td align="right">
                    <span style="display:inline-block;padding:6px 14px;background-color:#ea580c;border-radius:20px;color:#ffffff;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;">
                      New Lead
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td style="padding:24px 32px 12px 32px;">
              <h1 style="margin:0;font-size:20px;font-weight:800;color:#0f172a;">New Commercial Project Scope Received</h1>
              <p style="margin:6px 0 0 0;font-size:13px;color:#64748b;">
                Submitted via official website enquiry form on <strong style="color:#ea580c;">{$timestamp}</strong>
              </p>
            </td>
          </tr>

          <!-- Client Details Grid -->
          <tr>
            <td style="padding:12px 32px 20px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border:1px solid #fed7aa;border-radius:12px;overflow:hidden;">
                <tr>
                  <td colspan="2" style="padding:12px 16px;background-color:#fff7ed;border-bottom:1px solid #fed7aa;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#c2410c;">
                    Client &amp; Organization Information
                  </td>
                </tr>
                <tr>
                  <td width="35%" style="padding:10px 16px;font-size:12px;color:#64748b;border-bottom:1px solid #f1f5f9;">Client Name</td>
                  <td width="65%" style="padding:10px 16px;font-size:13px;font-weight:700;color:#0f172a;border-bottom:1px solid #f1f5f9;">{$safeName}</td>
                </tr>
                <tr>
                  <td style="padding:10px 16px;font-size:12px;color:#64748b;border-bottom:1px solid #f1f5f9;">Official Email</td>
                  <td style="padding:10px 16px;font-size:13px;font-weight:600;color:#ea580c;border-bottom:1px solid #f1f5f9;">
                    <a href="mailto:{$safeEmail}" style="color:#ea580c;text-decoration:none;font-weight:700;">{$safeEmail}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 16px;font-size:12px;color:#64748b;border-bottom:1px solid #f1f5f9;">Phone / WhatsApp</td>
                  <td style="padding:10px 16px;font-size:13px;font-weight:700;color:#0f172a;border-bottom:1px solid #f1f5f9;">
                    <a href="tel:{$safePhone}" style="color:#0f172a;text-decoration:none;">{$safePhone}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 16px;font-size:12px;color:#64748b;border-bottom:1px solid #f1f5f9;">Company / Org</td>
                  <td style="padding:10px 16px;font-size:13px;color:#334155;border-bottom:1px solid #f1f5f9;">{$safeCompany}</td>
                </tr>
                <tr>
                  <td style="padding:10px 16px;font-size:12px;color:#64748b;border-bottom:1px solid #f1f5f9;">GSTIN Number</td>
                  <td style="padding:10px 16px;font-size:12px;font-family:monospace;font-weight:700;color:#ea580c;border-bottom:1px solid #f1f5f9;">{$safeGstin}</td>
                </tr>
                <tr>
                  <td style="padding:10px 16px;font-size:12px;color:#64748b;">Address / Location</td>
                  <td style="padding:10px 16px;font-size:12px;color:#334155;">{$safeAddress}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Scope & Budget Details -->
          <tr>
            <td style="padding:0 32px 24px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border:1px solid #fed7aa;border-radius:12px;overflow:hidden;">
                <tr>
                  <td colspan="2" style="padding:12px 16px;background-color:#fff7ed;border-bottom:1px solid #fed7aa;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#c2410c;">
                    Project Scope &amp; Specifications
                  </td>
                </tr>
                <tr>
                  <td width="35%" style="padding:10px 16px;font-size:12px;color:#64748b;border-bottom:1px solid #f1f5f9;">Service Category</td>
                  <td width="65%" style="padding:10px 16px;font-size:13px;font-weight:700;color:#0f172a;border-bottom:1px solid #f1f5f9;">{$safeCategory}</td>
                </tr>
                <tr>
                  <td style="padding:10px 16px;font-size:12px;color:#64748b;border-bottom:1px solid #f1f5f9;">Budget Range</td>
                  <td style="padding:10px 16px;font-size:13px;font-weight:700;color:#ea580c;border-bottom:1px solid #f1f5f9;">{$safeBudget}</td>
                </tr>
                <tr>
                  <td style="padding:10px 16px;font-size:12px;color:#64748b;border-bottom:1px solid #f1f5f9;">Target Timeline</td>
                  <td style="padding:10px 16px;font-size:12px;font-weight:600;color:#334155;border-bottom:1px solid #f1f5f9;">{$safeTimeline}</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding:14px 16px 8px 16px;font-size:12px;font-weight:700;color:#64748b;">
                    Project Description &amp; Requirements:
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding:0 16px 16px 16px;">
                    <div style="padding:14px;background-color:#fafaf9;border:1px solid #e2e8f0;border-left:4px solid #ea580c;border-radius:8px;font-size:13px;line-height:1.6;color:#1e293b;">
                      {$safeDescription}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Quick Action Button -->
          <tr>
            <td style="padding:0 32px 28px 32px;" align="center">
              <a href="mailto:{$safeEmail}?subject=Re:%20Fusion%20Forge%20Creation%20-%20Project%20Scope%20Quotation" style="display:inline-block;padding:12px 30px;background-color:#ea580c;color:#ffffff;text-decoration:none;font-size:13px;font-weight:800;border-radius:8px;box-shadow:0 4px 12px rgba(234,88,12,0.3);letter-spacing:0.3px;">
                Reply to {$safeName} Directly &rarr;
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:18px 32px;background-color:#f8fafc;border-top:1px solid #e2e8f0;font-size:11px;color:#64748b;text-align:center;line-height:1.5;">
              <strong>Fusion Forge Creation</strong> • Automated Lead Dispatch • SAC 998314 • <a href="{$websiteUrl}" style="color:#ea580c;text-decoration:none;font-weight:600;">fusionforgecreation.com</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;

// 9. Build Customer Confirmation Email HTML (Light Theme with Orange Accents)
$customerSubjectPlain = "Project Scope Received — Fusion Forge Creation";
$customerSubject = encodeMimeSubject($customerSubjectPlain);

$customerBody = <<<HTML
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Project Scope Received</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f1f5f9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="640" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;width:100%;background-color:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;box-shadow:0 10px 25px -5px rgba(0,0,0,0.06), 0 8px 10px -6px rgba(0,0,0,0.04);">
          
          <!-- Header -->
          <tr>
            <td style="padding:32px 32px 24px 32px;background:linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);border-bottom:2px solid #fed7aa;">
              <div style="font-size:22px;font-weight:900;letter-spacing:1px;color:#0f172a;text-transform:uppercase;">
                FUSION FORGE <span style="color:#ea580c;">CREATION</span>
              </div>
              <div style="font-size:11px;color:#c2410c;letter-spacing:2px;text-transform:uppercase;margin-top:4px;font-weight:600;">
                Where Ideas Fuse With Technology
              </div>
            </td>
          </tr>

          <!-- Message Body -->
          <tr>
            <td style="padding:28px 32px 16px 32px;">
              <h1 style="margin:0;font-size:20px;font-weight:800;color:#0f172a;">Thank You for Reaching Out, {$safeName}!</h1>
              <p style="margin:12px 0 0 0;font-size:14px;color:#475569;line-height:1.7;">
                We have successfully received your project scope submission. Our solutions architect and technical team are currently reviewing your requirements and will formulate a structured commercial and architectural proposal for you within <strong style="color:#ea580c;">24 business hours</strong>.
              </p>
            </td>
          </tr>

          <!-- Summary Box -->
          <tr>
            <td style="padding:8px 32px 20px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border:1px solid #fed7aa;border-radius:12px;overflow:hidden;">
                <tr>
                  <td colspan="2" style="padding:12px 16px;background-color:#fff7ed;border-bottom:1px solid #fed7aa;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#c2410c;">
                    Summary of Your Submitted Scope
                  </td>
                </tr>
                <tr>
                  <td width="38%" style="padding:10px 16px;font-size:12px;color:#64748b;border-bottom:1px solid #f1f5f9;">Service Requested</td>
                  <td width="62%" style="padding:10px 16px;font-size:13px;font-weight:700;color:#0f172a;border-bottom:1px solid #f1f5f9;">{$safeCategory}</td>
                </tr>
                <tr>
                  <td style="padding:10px 16px;font-size:12px;color:#64748b;border-bottom:1px solid #f1f5f9;">Estimated Budget</td>
                  <td style="padding:10px 16px;font-size:13px;font-weight:700;color:#ea580c;border-bottom:1px solid #f1f5f9;">{$safeBudget}</td>
                </tr>
                <tr>
                  <td style="padding:10px 16px;font-size:12px;color:#64748b;">Expected Timeline</td>
                  <td style="padding:10px 16px;font-size:12px;font-weight:600;color:#334155;">{$safeTimeline}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Next Steps -->
          <tr>
            <td style="padding:0 32px 24px 32px;">
              <div style="padding:18px;background-color:#fff7ed;border:1px solid #fed7aa;border-radius:12px;">
                <div style="font-size:12px;font-weight:800;color:#c2410c;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">
                  What Happens Next?
                </div>
                <ol style="margin:0;padding-left:18px;font-size:13px;color:#475569;line-height:1.7;">
                  <li>Technical feasibility &amp; architectural stack analysis.</li>
                  <li>Drafting of deliverables, milestones, and commercial quotation.</li>
                  <li>Direct consultation over email or WhatsApp / Phone to finalize kickoff.</li>
                </ol>
              </div>
            </td>
          </tr>

          <!-- Direct Contact Strip -->
          <tr>
            <td style="padding:0 32px 28px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fafaf9;border:1px solid #e2e8f0;border-radius:10px;padding:14px 16px;">
                <tr>
                  <td style="font-size:12px;color:#64748b;">
                    Need immediate assistance? Reach our engineering desk directly:
                    <div style="margin-top:6px;font-size:13px;font-weight:700;color:#0f172a;">
                      Email: <a href="mailto:{$officialEmail}" style="color:#ea580c;text-decoration:none;">{$officialEmail}</a> &nbsp;|&nbsp; 
                      Phone: <a href="tel:{$officialPhone}" style="color:#0f172a;text-decoration:none;">{$officialPhone}</a>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;background-color:#f8fafc;border-top:1px solid #e2e8f0;font-size:11px;color:#64748b;text-align:center;line-height:1.6;">
              <strong>Fusion Forge Creation</strong> — Where Ideas Fuse With Technology<br>
              Premier Software Engineering Agency • SAC 998314 • <a href="{$websiteUrl}" style="color:#ea580c;text-decoration:none;font-weight:600;">{$websiteUrl}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;

// 10. Check for Server-Side SMTP Configuration
$smtpConfig = null;

// Look for optional local config file (e.g., public/api/email-config.php or private server config)
$configPaths = [
    __DIR__ . '/email-config.php',
    __DIR__ . '/config.php',
    dirname(__DIR__, 2) . '/email-config.php'
];

foreach ($configPaths as $path) {
    if (file_exists($path)) {
        $loaded = include $path;
        if (is_array($loaded)) {
            $smtpConfig = $loaded;
            break;
        }
    }
}

// Or check server environment variables
if (!$smtpConfig && getenv('SMTP_PASSWORD')) {
    $smtpConfig = [
        'host' => getenv('SMTP_HOST') ?: 'smtp.hostinger.com',
        'port' => (int)(getenv('SMTP_PORT') ?: 465),
        'user' => getenv('SMTP_USER') ?: 'admin@fusionforgecreation.com',
        'pass' => getenv('SMTP_PASSWORD') ?: '',
        'secure' => getenv('SMTP_SECURE') ?: 'ssl'
    ];
}

// 11. Native Standalone PHP SMTP Socket Client (Zero Dependencies)
function sendViaHostingerSmtp($toEmail, $toName, $subject, $htmlBody, $replyToEmail, $replyToName, $config) {
    $host = $config['host'] ?? 'smtp.hostinger.com';
    $port = (int)($config['port'] ?? 465);
    $user = $config['user'] ?? 'admin@fusionforgecreation.com';
    $pass = $config['pass'] ?? '';
    $secure = $config['secure'] ?? ($port === 465 ? 'ssl' : 'tls');

    $protocol = ($secure === 'ssl') ? 'ssl://' : '';
    $socket = @fsockopen($protocol . $host, $port, $errno, $errstr, 12);
    if (!$socket) {
        return false;
    }

    $read = function() use ($socket) {
        $res = '';
        while ($line = fgets($socket, 515)) {
            $res .= $line;
            if (isset($line[3]) && $line[3] === ' ') break;
        }
        return $res;
    };

    $write = function($cmd) use ($socket) {
        fputs($socket, $cmd . "\r\n");
    };

    $initial = $read();
    if (substr($initial, 0, 3) !== '220') {
        fclose($socket);
        return false;
    }

    $write('EHLO ' . ($_SERVER['SERVER_NAME'] ?? 'fusionforgecreation.com'));
    $ehlo = $read();

    if ($secure === 'tls' && $port === 587) {
        $write('STARTTLS');
        $read();
        stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
        $write('EHLO ' . ($_SERVER['SERVER_NAME'] ?? 'fusionforgecreation.com'));
        $read();
    }

    $write('AUTH LOGIN');
    $authResp = $read();
    if (substr($authResp, 0, 3) !== '334') {
        fclose($socket);
        return false;
    }

    $write(base64_encode($user));
    $read();
    $write(base64_encode($pass));
    $loginResp = $read();
    if (substr($loginResp, 0, 3) !== '235') {
        fclose($socket);
        return false;
    }

    $write('MAIL FROM:<' . $user . '>');
    $fromResp = $read();
    if (substr($fromResp, 0, 3) !== '250') {
        fclose($socket);
        return false;
    }

    $write('RCPT TO:<' . $toEmail . '>');
    $rcptResp = $read();
    if (substr($rcptResp, 0, 3) !== '250' && substr($rcptResp, 0, 3) !== '251') {
        fclose($socket);
        return false;
    }

    $write('DATA');
    $dataResp = $read();
    if (substr($dataResp, 0, 3) !== '354') {
        fclose($socket);
        return false;
    }

    $msgId = '<' . time() . '.' . bin2hex(random_bytes(8)) . '@fusionforgecreation.com>';
    $date = date('r');

    $cleanToName = cleanHeader($toName);
    $cleanReplyName = cleanHeader($replyToName);
    $cleanReplyEmail = cleanHeader($replyToEmail);

    $raw = [];
    $raw[] = "Date: {$date}";
    $raw[] = "To: =?UTF-8?B?" . base64_encode($cleanToName) . "?= <{$toEmail}>";
    $raw[] = "From: =?UTF-8?B?" . base64_encode('Fusion Forge Creation') . "?= <{$user}>";
    $raw[] = "Reply-To: =?UTF-8?B?" . base64_encode($cleanReplyName) . "?= <{$cleanReplyEmail}>";
    $raw[] = "Subject: {$subject}";
    $raw[] = "Message-ID: {$msgId}";
    $raw[] = 'MIME-Version: 1.0';
    $raw[] = 'Content-Type: text/html; charset=UTF-8';
    $raw[] = 'Content-Transfer-Encoding: 8bit';
    $raw[] = 'X-Mailer: FusionForge-SMTP-Engine/1.0';
    $raw[] = '';
    $raw[] = $htmlBody;
    $raw[] = '.';

    $write(implode("\r\n", $raw));
    $finalResp = $read();

    $write('QUIT');
    fclose($socket);

    return (substr($finalResp, 0, 3) === '250');
}

// 12. Enhanced RFC 2822 PHP Mail with Envelope Sender
function sendViaPhpMailWithEnvelope($toEmail, $toName, $subject, $htmlBody, $fromEmail, $fromName, $replyToEmail, $replyToName) {
    $cleanFrom = cleanHeader($fromEmail);
    $cleanFromName = cleanHeader($fromName);
    $cleanReplyTo = cleanHeader($replyToEmail);
    $cleanReplyToName = cleanHeader($replyToName);
    $msgId = '<' . time() . '.' . bin2hex(random_bytes(8)) . '@fusionforgecreation.com>';
    $date = date('r');

    // On Linux/Hostinger, use standard \n or \r\n
    $headers = [];
    $headers[] = 'Date: ' . $date;
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-Type: text/html; charset=UTF-8';
    $headers[] = 'Content-Transfer-Encoding: 8bit';
    $headers[] = 'From: =?UTF-8?B?' . base64_encode($cleanFromName) . "?= <{$cleanFrom}>";
    $headers[] = 'Reply-To: =?UTF-8?B?' . base64_encode($cleanReplyToName) . "?= <{$cleanReplyTo}>";
    $headers[] = 'Return-Path: <' . $cleanFrom . '>';
    $headers[] = 'Message-ID: ' . $msgId;
    $headers[] = 'X-Mailer: FusionForge-LiteSpeed/1.0';

    $headerStr = implode("\r\n", $headers);

    // CRITICAL: The 5th parameter "-f" sets the envelope sender (Return-Path) to match the From domain,
    // which prevents Hostinger's local anti-spoofing filter from rejecting internal emails to admin@fusionforgecreation.com!
    $additionalParams = '-f' . $cleanFrom;

    return @mail($toEmail, $subject, $htmlBody, $headerStr, $additionalParams);
}

// 13. Execute Dispatches
$adminSent = false;
$customerSent = false;

// Try Authenticated SMTP First if credentials available
if (!empty($smtpConfig['pass'])) {
    $adminSent = sendViaHostingerSmtp($officialEmail, 'Fusion Forge Admin Desk', $adminSubject, $adminBody, $email, $name, $smtpConfig);
    $customerSent = sendViaHostingerSmtp($email, $name, $customerSubject, $customerBody, $officialEmail, $officialName, $smtpConfig);
}

// If SMTP was not configured or failed, fallback to enhanced PHP mail() with -f envelope sender
if (!$adminSent) {
    $adminSent = sendViaPhpMailWithEnvelope($officialEmail, 'Fusion Forge Admin Desk', $adminSubject, $adminBody, $officialEmail, $officialName, $email, $name);
}
if (!$customerSent) {
    $customerSent = sendViaPhpMailWithEnvelope($email, $name, $customerSubject, $customerBody, $officialEmail, $officialName, $officialEmail, $officialName);
}

// 14. Evaluate Outcome and Return Structured Response
if ($adminSent || $customerSent) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Project Scope enquiry received and email notifications dispatched.',
        'adminNotification' => [
            'sent' => (bool)$adminSent,
            'recipient' => $officialEmail
        ],
        'customerAutoReply' => [
            'sent' => (bool)$customerSent,
            'recipient' => $email
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Mail delivery service encountered a temporary error. Please email us directly at admin@fusionforgecreation.com.'
    ]);
}
