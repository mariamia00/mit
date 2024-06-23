<?php

// Mailer form data
$name = $_POST['name'];
$email = $_POST['email'];
$mobile = $_POST['mobile'];
$message = isset($_POST['message']) ? $_POST['message'] : ''; // Check if message field exists

// Set subject based on message presence
if (empty($message)) {
    $subject = "I want a demo";
} else {
    // If message exists, create an excerpt as subject
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

// Validate mobile format (adjust regex as per your requirement)
if (!preg_match('/^[0-9]{10}$/', $mobile)) {
    echo json_encode(array('status' => 'error', 'message' => 'Numarul de telefon nu este valid.'));
    exit;
}

// HTML email body
$htmlBody = "<p>Name: $name</p>";
$htmlBody .= "<p>Email: $email</p>";
($mobile !== "noMobile") ? $htmlBody .= "<p>Telefon: $mobile</p>" : "";
if (!empty($message)) {
    $htmlBody .= "<p>Mesaj: $message</p>";
}

// Recipient name. Change this name to your preference.
$recipientName = "MIT FORMS";

// Recipient email. Change this email to your preference.
$recipientEmail = "maria_mia00@yahoo.com";

// Initiate PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';

// Create an instance
$mail = new PHPMailer(true);

// Set mailer to use SMTP or PHP's mail() function
$useSMTP = true; // Set to true if using SMTP

if ($useSMTP) {
    // Server settings for SMTP (example using Gmail)
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->SMTPSecure = 'tls';
    $mail->Username = 'logiscool.sender@gmail.com'; // Replace with your email address
    $mail->Password = 'znopmieylbnymkwd'; // Replace with your email password
  
    $mail->Port = 587;
} else {
    // Server settings for PHP's mail() function
    $mail->isMail();
}

// Set recipients and mail content
$mail->setFrom($email, $name);
$mail->addAddress($recipientEmail, $recipientName);
$mail->addReplyTo($email, $name);
$mail->isHTML(true);
$mail->Subject = $subject;
$mail->Body = $htmlBody;

try {
    // Attempt to send email
    $mail->send();
    
    // Success response
    echo json_encode(array('status' => 'success', 'message' => 'Multumim pentru email!'));
} catch (Exception $e) {
    // Error response
    echo json_encode(array('status' => 'error', 'message' => 'Emailul nu a putut fi trimis. Incercati mai tarziu ' . $mail->ErrorInfo));
}
?>
