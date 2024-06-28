<?php

// Mailer form data
$name = $_POST['name'];
$email = $_POST['email'];
$mobile = isset($_POST['mobile']) ? $_POST['mobile'] : 'noMobile';
$message = isset($_POST['message']) ? $_POST['message'] : '';

// Set subject based on message presence
if (empty($message)) {
    $subject = "I want a demo";
} else {
    $excerptLength = 40;
    $excerpt = substr($message, 0, $excerptLength);
    $subject = rtrim($excerpt, ".") . "...";
}

// Validate required fields for both forms
if (empty($name) || empty($email)) {
    echo json_encode(array('status' => 'error', 'message' => 'Va rugam sa completati toate campurile.'));
    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(array('status' => 'error', 'message' => 'Adresa de email nu este valida.'));
    exit;
}

// Validate mobile format only if provided
if ($mobile !== 'noMobile' && !preg_match('/^[0-9]{10}$/', $mobile)) {
    echo json_encode(array('status' => 'error', 'message' => 'Numarul de telefon nu este valid.'));
    exit;
}

// HTML email body
$htmlBody = "<p>Name: $name</p>";
$htmlBody .= "<p>Email: $email</p>";
if ($mobile !== 'noMobile') {
    $htmlBody .= "<p>Telefon: $mobile</p>";
}
if (!empty($message)) {
    $htmlBody .= "<p>Mesaj: $message</p>";
}

$recipientName = "MIT FORMS";
$recipientEmail = "maria_mia00@yahoo.com";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';

$mail = new PHPMailer(true);

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

$mail->setFrom($email, $name);
$mail->addAddress($recipientEmail, $recipientName);
$mail->addReplyTo($email, $name);
$mail->isHTML(true);
$mail->Subject = $subject;
$mail->Body = $htmlBody;

try {
    $mail->send();
    echo json_encode(array('status' => 'success', 'message' => 'Multumim pentru email!'));
} catch (Exception $e) {
    echo json_encode(array('status' => 'error', 'message' => 'Emailul nu a putut fi trimis. Incercati mai tarziu ' . $mail->ErrorInfo));
}
?>
