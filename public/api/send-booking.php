<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

function loadLocalEnvFile(string $filePath): void
{
  if (!is_file($filePath) || !is_readable($filePath)) {
    return;
  }

  $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
  if ($lines === false) {
    return;
  }

  foreach ($lines as $line) {
    $trimmed = trim($line);
    if ($trimmed === '' || str_starts_with($trimmed, '#')) {
      continue;
    }

    $parts = explode('=', $trimmed, 2);
    if (count($parts) !== 2) {
      continue;
    }

    $key = trim($parts[0]);
    $value = trim($parts[1]);
    if ($key === '') {
      continue;
    }

    if (
      (str_starts_with($value, '"') && str_ends_with($value, '"')) ||
      (str_starts_with($value, "'") && str_ends_with($value, "'"))
    ) {
      $value = substr($value, 1, -1);
    }

    if (getenv($key) === false) {
      putenv($key . '=' . $value);
      $_ENV[$key] = $value;
      $_SERVER[$key] = $value;
    }
  }
}

loadLocalEnvFile(__DIR__ . '/.env');
loadLocalEnvFile(dirname(__DIR__) . '/.env');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = [
    'https://metromobilemechanics.co.za',
    'https://www.metromobilemechanics.co.za',
];

if (preg_match('/^https?:\/\/(localhost|127\.0\.0\.1)(:\\d+)?$/i', $origin) || in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}

header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  http_response_code(200);

  $hasSmtpConfig =
    (getenv('EMAIL_HOST') ?: '') !== '' &&
    (getenv('EMAIL_USER') ?: '') !== '' &&
    (getenv('EMAIL_PASSWORD') ?: '') !== '';

  echo json_encode([
    'success' => true,
    'message' => 'Booking endpoint is live. Submit bookings with POST JSON.',
    'smtpConfigured' => $hasSmtpConfig,
  ]);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['success' => false, 'message' => 'Method not allowed']);
  exit;
}

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput ?: '{}', true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON payload.']);
    exit;
}

$requiredFields = ['firstName', 'lastName', 'email', 'phone', 'serviceType', 'preferredDate'];
foreach ($requiredFields as $field) {
    if (empty($data[$field])) {
        http_response_code(422);
        echo json_encode(['success' => false, 'message' => "Missing required field: {$field}"]);
        exit;
    }
}

$customerEmail = trim((string)($data['email'] ?? ''));
if (!filter_var($customerEmail, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Invalid customer email address.']);
    exit;
}

$preferredDate = trim((string)($data['preferredDate'] ?? ''));
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $preferredDate)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Invalid preferred date format.']);
    exit;
}

$requestedDate = DateTime::createFromFormat('Y-m-d', $preferredDate);
$today = new DateTime('today');
if (!$requestedDate || $requestedDate < $today) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Preferred date cannot be in the past.']);
    exit;
}

$fromEmail = getenv('FROM_EMAIL') ?: 'noreply@metromobilemechanics.co.za';
$fromName = getenv('FROM_NAME') ?: 'Metro Mobile Mechanics';
$bookingToEmail = getenv('BOOKING_TO_EMAIL') ?: 'bookings@metromobilemechanics.co.za';
$businessCellphone = '+27 73 269 6847';

$smtpHost = getenv('EMAIL_HOST') ?: '';
$smtpPort = (int)(getenv('EMAIL_PORT') ?: 587);
$smtpUser = getenv('EMAIL_USER') ?: '';
$smtpPass = getenv('EMAIL_PASSWORD') ?: '';
$smtpEncryption = strtolower((string)(getenv('EMAIL_ENCRYPTION') ?: 'tls'));
$appDebug = getenv('APP_DEBUG') === '1';

$firstName = htmlspecialchars((string)($data['firstName'] ?? ''), ENT_QUOTES, 'UTF-8');
$lastName = htmlspecialchars((string)($data['lastName'] ?? ''), ENT_QUOTES, 'UTF-8');
$phone = htmlspecialchars((string)($data['phone'] ?? ''), ENT_QUOTES, 'UTF-8');
$address = htmlspecialchars((string)($data['address'] ?? ''), ENT_QUOTES, 'UTF-8');
$city = htmlspecialchars((string)($data['city'] ?? ''), ENT_QUOTES, 'UTF-8');
$zipCode = htmlspecialchars((string)($data['zipCode'] ?? ''), ENT_QUOTES, 'UTF-8');
$carYear = htmlspecialchars((string)($data['carYear'] ?? ''), ENT_QUOTES, 'UTF-8');
$carMake = htmlspecialchars((string)($data['carMake'] ?? ''), ENT_QUOTES, 'UTF-8');
$carModel = htmlspecialchars((string)($data['carModel'] ?? ''), ENT_QUOTES, 'UTF-8');
$carMileage = htmlspecialchars((string)($data['carMileage'] ?? 'Not specified'), ENT_QUOTES, 'UTF-8');
$vin = htmlspecialchars((string)($data['vin'] ?? 'Not provided'), ENT_QUOTES, 'UTF-8');
$serviceType = htmlspecialchars((string)($data['serviceType'] ?? ''), ENT_QUOTES, 'UTF-8');
$preferredTime = htmlspecialchars((string)($data['preferredTime'] ?? 'Not specified'), ENT_QUOTES, 'UTF-8');
$description = htmlspecialchars((string)($data['description'] ?? 'No additional details provided.'), ENT_QUOTES, 'UTF-8');

$fullName = trim($firstName . ' ' . $lastName);
$subject = "New Booking: {$serviceType} - {$fullName}";

$adminHtml = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; background:#f4f4f4; margin:0; padding:0; }
    .wrapper { max-width:640px; margin:30px auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,.12); }
    .header { background:#1a1a1a; padding:28px 32px; text-align:center; }
    .header h1 { color:#f97316; margin:0; font-size:22px; letter-spacing:1px; text-transform:uppercase; }
    .header p  { color:#9ca3af; margin:6px 0 0; font-size:13px; }
    .content { padding:28px 32px; }
    .section-title { font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#f97316; border-bottom:1px solid #e5e7eb; padding-bottom:6px; margin:24px 0 12px; }
    table { width:100%; border-collapse:collapse; font-size:14px; }
    td { padding:8px 0; vertical-align:top; }
    td:first-child { color:#6b7280; width:45%; padding-right:12px; }
    td:last-child { color:#111827; font-weight:500; }
    .footer { background:#f9fafb; text-align:center; padding:16px 32px; font-size:12px; color:#9ca3af; border-top:1px solid #e5e7eb; }
  </style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <h1>Metro Mobile Mechanics</h1>
    <p>New Booking Request</p>
  </div>
  <div class="content">
    <div class="section-title">Customer Information</div>
    <table>
      <tr><td>Full Name</td><td>{$fullName}</td></tr>
      <tr><td>Email</td><td>{$customerEmail}</td></tr>
      <tr><td>Phone</td><td>{$phone}</td></tr>
      <tr><td>Address</td><td>{$address}, {$city} {$zipCode}</td></tr>
    </table>

    <div class="section-title">Vehicle Information</div>
    <table>
      <tr><td>Year</td><td>{$carYear}</td></tr>
      <tr><td>Make</td><td>{$carMake}</td></tr>
      <tr><td>Model</td><td>{$carModel}</td></tr>
      <tr><td>Mileage</td><td>{$carMileage}</td></tr>
      <tr><td>VIN</td><td>{$vin}</td></tr>
    </table>

    <div class="section-title">Service Request</div>
    <table>
      <tr><td>Service Type</td><td>{$serviceType}</td></tr>
      <tr><td>Preferred Date</td><td>{$preferredDate}</td></tr>
      <tr><td>Preferred Time</td><td>{$preferredTime}</td></tr>
    </table>

    <div class="section-title">Additional Details</div>
    <p style="font-size:14px;color:#374151;margin:0">{$description}</p>
  </div>
  <div class="footer">
    This email was automatically generated from the booking form on metromobilemechanics.co.za.<br>
    Reply directly to this message to respond to the customer.
  </div>
</div>
</body>
</html>
HTML;

$customerSubject = 'Booking Received - Quote to Follow | Metro Mobile Mechanics';
$customerHtml = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; background:#f4f4f4; margin:0; padding:0; }
    .wrapper { max-width:640px; margin:30px auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,.12); }
    .header { background:#1a1a1a; padding:28px 32px; text-align:center; }
    .header h1 { color:#f97316; margin:0; font-size:22px; letter-spacing:1px; text-transform:uppercase; }
    .header p  { color:#9ca3af; margin:6px 0 0; font-size:13px; }
    .content { padding:28px 32px; color:#374151; }
    .highlight { color:#f97316; font-weight:700; }
    .box { margin-top:18px; border:1px solid #e5e7eb; border-radius:8px; padding:14px; background:#f9fafb; }
    .footer { background:#f9fafb; text-align:center; padding:16px 32px; font-size:12px; color:#9ca3af; border-top:1px solid #e5e7eb; }
  </style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <h1>Metro Mobile Mechanics</h1>
    <p>Booking Confirmation</p>
  </div>
  <div class="content">
    <p>Hi {$firstName},</p>
    <p>Thank you for your booking request. We have received your request for <span class="highlight">{$serviceType}</span>.</p>
    <div class="box">
      <p style="margin:0 0 6px 0;"><strong>Preferred Date:</strong> {$preferredDate}</p>
      <p style="margin:0;"><strong>Preferred Time:</strong> {$preferredTime}</p>
    </div>
    <p style="margin-top:18px;">Our team will review your request and send you a <span class="highlight">quote shortly</span>.</p>
    <p>If anything is urgent, please call or WhatsApp us.</p>
    <p style="margin:0;"><strong>Cellphone:</strong> {$businessCellphone}</p>
    <p style="margin-top:18px;">Warm regards,<br><strong>Metro Mobile Mechanics Team</strong></p>
  </div>
  <div class="footer">
    Metro Mobile Mechanics<br>
    {$bookingToEmail}<br>
    {$businessCellphone}
  </div>
</div>
</body>
</html>
HTML;

function smtpReadResponse($socket, array $expectedCodes): void
{
  $response = '';
  while (($line = fgets($socket, 515)) !== false) {
    $response .= $line;
    if (strlen($line) < 4 || $line[3] !== '-') {
      break;
    }
  }

  $code = (int)substr($response, 0, 3);
  if (!in_array($code, $expectedCodes, true)) {
    throw new RuntimeException('SMTP error: ' . trim($response));
  }
}

function smtpWrite($socket, string $command): void
{
  fwrite($socket, $command . "\r\n");
}

function smtpSendHtmlMail(array $cfg, string $fromEmail, string $fromName, string $toEmail, string $subject, string $htmlBody, string $replyTo = ''): void
{
  $transportHost = $cfg['encryption'] === 'ssl' ? 'ssl://' . $cfg['host'] : $cfg['host'];
  $socket = @stream_socket_client($transportHost . ':' . $cfg['port'], $errno, $errstr, 20, STREAM_CLIENT_CONNECT);
  if (!$socket) {
    throw new RuntimeException('SMTP connection failed: ' . $errstr . ' (' . $errno . ')');
  }

  stream_set_timeout($socket, 20);

  smtpReadResponse($socket, [220]);
  smtpWrite($socket, 'EHLO metromobilemechanics.co.za');
  smtpReadResponse($socket, [250]);

  if ($cfg['encryption'] === 'tls') {
    smtpWrite($socket, 'STARTTLS');
    smtpReadResponse($socket, [220]);
    if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
      throw new RuntimeException('Could not enable TLS encryption.');
    }
    smtpWrite($socket, 'EHLO metromobilemechanics.co.za');
    smtpReadResponse($socket, [250]);
  }

  if ($cfg['user'] !== '' && $cfg['pass'] !== '') {
    smtpWrite($socket, 'AUTH LOGIN');
    smtpReadResponse($socket, [334]);
    smtpWrite($socket, base64_encode($cfg['user']));
    smtpReadResponse($socket, [334]);
    smtpWrite($socket, base64_encode($cfg['pass']));
    smtpReadResponse($socket, [235]);
  }

  smtpWrite($socket, 'MAIL FROM:<' . $fromEmail . '>');
  smtpReadResponse($socket, [250]);
  smtpWrite($socket, 'RCPT TO:<' . $toEmail . '>');
  smtpReadResponse($socket, [250, 251]);
  smtpWrite($socket, 'DATA');
  smtpReadResponse($socket, [354]);

  $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
  $headers = [
    'Date: ' . date(DATE_RFC2822),
    'From: ' . $fromName . ' <' . $fromEmail . '>',
    'To: <' . $toEmail . '>',
    'Subject: ' . $encodedSubject,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
  ];

  if ($replyTo !== '') {
    $headers[] = 'Reply-To: ' . $replyTo;
  }

  $safeBody = preg_replace('/\r?\n\./', "\n..", $htmlBody) ?? $htmlBody;
  $message = implode("\r\n", $headers) . "\r\n\r\n" . $safeBody . "\r\n.";
  fwrite($socket, $message . "\r\n");
  smtpReadResponse($socket, [250]);

  smtpWrite($socket, 'QUIT');
  fclose($socket);
}

$headersBase = [
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'From: ' . $fromName . ' <' . $fromEmail . '>',
];

try {
  $failureCode = 'unknown';

  if ($smtpHost !== '' && $smtpUser !== '' && $smtpPass !== '') {
    $failureCode = 'smtp_send_failed';
    $smtpCfg = [
      'host' => $smtpHost,
      'port' => $smtpPort,
      'user' => $smtpUser,
      'pass' => $smtpPass,
      'encryption' => $smtpEncryption,
    ];

    smtpSendHtmlMail(
      $smtpCfg,
      $fromEmail,
      $fromName,
      $bookingToEmail,
      $subject,
      $adminHtml,
      $fullName . ' <' . $customerEmail . '>'
    );

    smtpSendHtmlMail(
      $smtpCfg,
      $fromEmail,
      $fromName,
      $customerEmail,
      $customerSubject,
      $customerHtml
    );
  } else {
    $failureCode = 'php_mail_failed';
    $adminHeaders = $headersBase;
    $adminHeaders[] = 'Reply-To: ' . $fullName . ' <' . $customerEmail . '>';
    $adminSent = @mail($bookingToEmail, $subject, $adminHtml, implode("\r\n", $adminHeaders));

    $customerHeaders = $headersBase;
    $customerSent = @mail($customerEmail, $customerSubject, $customerHtml, implode("\r\n", $customerHeaders));

    if (!$adminSent || !$customerSent) {
      throw new RuntimeException('Email could not be sent from PHP mail(). Configure SMTP env vars or server mail transfer agent.');
    }
  }
} catch (Throwable $e) {
  $publicHint = 'Check SMTP configuration.';
  if (($failureCode ?? '') === 'php_mail_failed') {
    $publicHint = 'SMTP env vars are missing or PHP mail() is not configured on this server.';
  }

  http_response_code(500);
  echo json_encode([
    'success' => false,
    'message' => $appDebug ? $e->getMessage() : 'Email could not be sent.',
    'errorCode' => $failureCode ?? 'unknown',
    'hint' => $publicHint,
  ]);
  exit;
}

http_response_code(200);
echo json_encode(['success' => true, 'message' => 'Booking and confirmation emails sent successfully.']);
