<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Load SMTP configuration
// Priority: Environment variables (Vercel/production) > Config file (local development)
$smtpConfig = [];

// Check for environment variables first (Vercel/production)
if (getenv('SMTP_HOST')) {
    $smtpConfig = [
        'smtp_host' => getenv('SMTP_HOST'),
        'smtp_port' => (int)getenv('SMTP_PORT') ?: 587,
        'smtp_encryption' => getenv('SMTP_ENCRYPTION') ?: 'tls',
        'smtp_auth' => getenv('SMTP_AUTH') !== 'false',
        'smtp_username' => getenv('SMTP_USERNAME'),
        'smtp_password' => getenv('SMTP_PASSWORD'),
        'from_email' => getenv('FROM_EMAIL') ?: getenv('SMTP_USERNAME'),
        'from_name' => getenv('FROM_NAME') ?: 'IntechDigital Website',
        'to_email' => getenv('TO_EMAIL') ?: 'erfan.intech@gmail.com',
        'reply_to_email' => getenv('REPLY_TO_EMAIL') ?: 'info@intechdigital.xyz',
        'reply_to_name' => getenv('REPLY_TO_NAME') ?: 'IntechDigital Support',
    ];
} elseif (file_exists(__DIR__ . '/smtp_config.php')) {
    // Fall back to config file for local development
    $smtpConfig = require __DIR__ . '/smtp_config.php';
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'SMTP configuration not found. Please configure environment variables or create smtp_config.php'
    ]);
    exit;
}

// Load PHPMailer
$phpmailerPath = __DIR__ . '/PHPMailer/src/PHPMailer.php';
$composerPath = __DIR__ . '/vendor/autoload.php';

if (file_exists($composerPath)) {
    require_once $composerPath;
} elseif (file_exists($phpmailerPath)) {
    require_once $phpmailerPath;
    require_once __DIR__ . '/PHPMailer/src/SMTP.php';
    require_once __DIR__ . '/PHPMailer/src/Exception.php';
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'PHPMailer not found. Please download PHPMailer. See README_SMTP_SETUP.md for instructions.'
    ]);
    exit;
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Get and sanitize form data
$name = isset($_POST['name']) ? trim(htmlspecialchars($_POST['name'])) : '';
$email = isset($_POST['email']) ? trim(filter_var($_POST['email'], FILTER_SANITIZE_EMAIL)) : '';
$organization = isset($_POST['organization']) ? trim(htmlspecialchars($_POST['organization'])) : '';
$interest = isset($_POST['interest']) ? trim(htmlspecialchars($_POST['interest'])) : '';
$message = isset($_POST['message']) ? trim(htmlspecialchars($_POST['message'])) : '';

// Validation
$errors = [];
if (empty($name)) {
    $errors[] = 'Name is required';
}
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Valid email is required';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

// Map interest values to readable text
$interestMap = [
    'school-portal' => 'School Management Portal',
    'shop-system' => 'Shop Management System',
    'both' => 'Both solutions',
    'other' => 'Other software solutions'
];
$interestText = isset($interestMap[$interest]) ? $interestMap[$interest] : $interest;

// Create PHPMailer instance
$mail = new PHPMailer(true);

try {
    // SMTP Configuration
    $mail->isSMTP();
    $mail->Host = $smtpConfig['smtp_host'];
    $mail->SMTPAuth = $smtpConfig['smtp_auth'];
    $mail->Username = $smtpConfig['smtp_username'];
    $mail->Password = $smtpConfig['smtp_password'];
    $mail->SMTPSecure = $smtpConfig['smtp_encryption'];
    $mail->Port = $smtpConfig['smtp_port'];
    
    // Enable verbose debug output (optional, for troubleshooting)
    // $mail->SMTPDebug = SMTP::DEBUG_SERVER;
    
    // Email settings
    $mail->setFrom(
        $smtpConfig['from_email'],
        $smtpConfig['from_name']
    );
    $mail->addAddress($smtpConfig['to_email']);
    
    // Reply-To
    if (!empty($smtpConfig['reply_to_email'])) {
        $mail->addReplyTo(
            $smtpConfig['reply_to_email'],
            $smtpConfig['reply_to_name'] ?? 'IntechDigital Support'
        );
    }
    
    // Also set reply-to to the form submitter's email
    $mail->addReplyTo($email, $name);
    
    // Email content
    $mail->isHTML(false); // Plain text email
    $mail->Subject = 'New Contact Form Submission - IntechDigital Website';
    $mail->Body = "New contact form submission from IntechDigital website\n\n";
    $mail->Body .= "Name: " . $name . "\n";
    $mail->Body .= "Email: " . $email . "\n";
    $mail->Body .= "Organization: " . ($organization ? $organization : 'Not provided') . "\n";
    $mail->Body .= "Interest: " . $interestText . "\n";
    $mail->Body .= "Message:\n" . ($message ? $message : 'No message provided') . "\n\n";
    $mail->Body .= "---\n";
    $mail->Body .= "Submitted on: " . date('Y-m-d H:i:s') . "\n";
    $mail->Body .= "IP Address: " . ($_SERVER['REMOTE_ADDR'] ?? 'Unknown') . "\n";
    
    // Send email
    $mail->send();
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Thank you for your message. We will get back to you soon!'
    ]);
    
} catch (Exception $e) {
    // Log error for debugging (optional)
    error_log("PHPMailer Error: " . $mail->ErrorInfo);
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Sorry, there was an error sending your message. Please try again later or contact us directly at info@intechdigital.xyz'
    ]);
}
?>

