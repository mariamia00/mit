<?php


// Mailer form data
$name = $_POST['name'];
$email = $_POST['email'];
$mobile = $_POST['mobile'];
$message = $_POST['message'];
//create intro of message as subject
$excerptLength = 40;
$excerpt = substr($message, 0, $excerptLength);
$subject = $excerpt . "...";

if (empty($name) || empty($email) || empty($message) || empty($mobile)) {
    echo json_encode(array('status' => 'error', 'message' => 'Va rugam sa completati toate campurile.'));
    exit;
}
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
$htmlBody .= "<p>Mesaj: $message</p>";

// Recipient name. Change this name to your
$recipientName = "MIT FORMS";

// Recipient email. Change this email to your
$recipientEmail = "maria_mia00@yahoo.com";

// Initiate PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';

//Create an instance
$mail = new PHPMailer(true);

// Set mailer to use SMTP or PHP's mail() function
// If you use SMTP, it will be "true". Otherwise, it will be "false"
$useSMTP = true;

if ($useSMTP) {
    // Server settings for SMTP
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->SMTPSecure = 'tls';
    $mail->Username = 'logiscool.sender@gmail.com';
    $mail->Password = 'znopmieylbnymkwd';
  
    $mail->Port = 587;
} else {
    // Server settings for PHP's mail()
    $mail->isMail();
}

// Recipients info
$mail->setFrom($email, $name);
$mail->addAddress($recipientEmail, $recipientName);
$mail->addReplyTo($email, $name);
// Mail content
$mail->isHTML(true);
$mail->Subject = $subject;
$mail->Body = $htmlBody;

try {
    // Mail send
    $mail->send();
    
    // Passing success message with "success" status
    echo json_encode(array('status' => 'success', 'message' => 'Multumim pentru email!'));
} catch (Exception $e) {
    // Passing error message with "error" status
    echo json_encode(array('status' => 'error', 'message' => 'Emailul nu a putut fi trimis. Incercati mai tarziu ' . $mail->ErrorInfo));
}


?>