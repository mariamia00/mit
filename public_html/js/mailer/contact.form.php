<?php
// Mailer form data
$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$mobile = $_POST['phone'] ?? '';
$message = $_POST['message'] ?? '';

// Function to validate phone number format
function validatePhoneNumber($phone) {
    return preg_match('/^[0-9]{10}$/', $phone);
}

// Set subject based on message presence
if (empty($message)) {
    $subject = "Vreau sa vad lectia demo";
} else {
    $excerptLength = 40;
    $excerpt = substr($message, 0, $excerptLength);
    $subject = rtrim($excerpt, ".") . "...";
}

// Validate required fields for both forms
if (empty($name) || empty($email) || empty($mobile)) {
    echo json_encode(array('status' => 'error', 'message' => 'Va rugam sa completati toate campurile.'));
    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(array('status' => 'error', 'message' => 'Adresa de email nu este valida.'));
    exit;
}

// Validate mobile format
if (!validatePhoneNumber($mobile)) {
    echo json_encode(array('status' => 'error', 'message' => 'Numarul de telefon nu este valid.'));
    exit;
}

// HTML email body
$htmlBody = "<p><b>Name:</b> " . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . "</p>";
$htmlBody .= "<p><b>Email:</b> " . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . "</p>";
$htmlBody .= "<p><b>Telefon:</b> " . htmlspecialchars($mobile, ENT_QUOTES, 'UTF-8') . "</p>";

if (!empty($message)) {
    $htmlBody .= "<p><b>Mesaj:</b></p><br><div style='background-color: whitesmoke; padding: 10px; line-height: 1.7;'>" . nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8')) . "</div>";
}

$recipientName = "MIT FORMS";
$recipientEmail = "mitinformaticcoding@gmail.com";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';

$mail = new PHPMailer(true);

// Use try-catch block for SMTP configuration
try {
    $useSMTP = true;

    if ($useSMTP) {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->SMTPSecure = 'tls';
        $mail->Username = 'logiscool.sender@gmail.com';
        $mail->Password = 'znopmieylbnymkwd';
        $mail->Port = 587;
    } else {
        $mail->isMail();
    }

    // Set email parameters
    $mail->setFrom($email, $name);
    $mail->addAddress($recipientEmail, $recipientName);
    $mail->addReplyTo($email, $name);
    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body = $htmlBody;

    // Attempt to send the email
    $mail->send();
    echo json_encode(array('status' => 'success', 'message' => 'Multumim pentru email!'));
} catch (Exception $e) {
    echo json_encode(array('status' => 'error', 'message' => 'Emailul nu a putut fi trimis. Incercati mai tarziu. Error: ' . $mail->ErrorInfo));
}
?>
