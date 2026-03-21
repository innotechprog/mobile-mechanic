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

function base64UrlDecode(string $value): string
{
  $padding = 4 - (strlen($value) % 4);
  if ($padding < 4) {
    $value .= str_repeat('=', $padding);
  }
  $decoded = base64_decode(strtr($value, '-_', '+/'), true);
  if ($decoded === false) {
    throw new RuntimeException('Invalid base64 token segment.');
  }
  return $decoded;
}

function verifyQuoteToken(string $token, string $secret): array
{
  $parts = explode('.', $token);
  if (count($parts) !== 2) {
    throw new RuntimeException('Invalid quote token format.');
  }

  [$payloadSegment, $signatureSegment] = $parts;
  $expectedSignature = rtrim(strtr(base64_encode(hash_hmac('sha256', $payloadSegment, $secret, true)), '+/', '-_'), '=');
  if (!hash_equals($expectedSignature, $signatureSegment)) {
    throw new RuntimeException('Invalid quote token signature.');
  }

  $payloadJson = base64UrlDecode($payloadSegment);
  $decoded = json_decode($payloadJson, true);
  if (!is_array($decoded)) {
    throw new RuntimeException('Invalid quote token payload.');
  }

  $expiresAt = (int)($decoded['exp'] ?? 0);
  if ($expiresAt <= 0 || time() > $expiresAt) {
    throw new RuntimeException('Quote token has expired.');
  }

  if (!isset($decoded['booking']) || !is_array($decoded['booking'])) {
    throw new RuntimeException('Quote token missing booking data.');
  }

  return $decoded['booking'];
}

function sanitizeBookingPayload(array $payload): array
{
  $fields = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'address',
    'city',
    'zipCode',
    'carYear',
    'carMake',
    'carModel',
    'carMileage',
    'vin',
    'serviceType',
    'preferredDate',
    'preferredTime',
    'description',
  ];

  $booking = [];
  foreach ($fields as $field) {
    $booking[$field] = trim((string)($payload[$field] ?? ''));
  }

  return $booking;
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
  echo json_encode([
    'success' => true,
    'message' => 'Quote token endpoint is live. Send token as POST JSON.',
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

$token = trim((string)($data['token'] ?? ''));
if ($token === '') {
  http_response_code(422);
  echo json_encode(['success' => false, 'message' => 'Missing quote token.']);
  exit;
}

$quoteLinkSecret = trim((string)(getenv('QUOTE_LINK_SECRET') ?: ''));
if ($quoteLinkSecret === '') {
  $quoteLinkSecret = trim((string)(getenv('EMAIL_PASSWORD') ?: ''));
}
if ($quoteLinkSecret === '') {
  $quoteLinkSecret = 'metro-mobile-quote-fallback-secret';
}

try {
  $booking = verifyQuoteToken($token, $quoteLinkSecret);
  http_response_code(200);
  echo json_encode([
    'success' => true,
    'booking' => sanitizeBookingPayload($booking),
  ]);
} catch (Throwable $e) {
  http_response_code(422);
  echo json_encode([
    'success' => false,
    'message' => $e->getMessage(),
  ]);
}
