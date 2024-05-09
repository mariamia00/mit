<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require '../vendor/autoload.php';


$name = isset($_POST['name']) ? $_POST['name'] : '';
$email = isset($_POST['email']) ? $_POST['email'] : '';
$subject = isset($_POST['subject']) ? $_POST['subject'] : '';
$phone = isset($_POST['phone']) ? $_POST['phone'] : '';

$message = isset($_POST['message']) ? $_POST['message'] : '';


// Validate inputs
if (empty($name) || empty($email) || empty($message) || empty($subject)) {
  // Set the response parameter directly without using the URL
  $response = "the-fields-are-empty";
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  // Set the response parameter directly without using the URL
  $response = "invalidemail";
} else {

  try {
    $mail = new PHPMailer(true);
    $mail->isSMTP();         //Send using SMTP
    $mail->SMTPAuth   = true;//Enable SMTP authentication
    $mail->Host = "smtp.gmail.com";
    $mail->Port = 587;
    $mail->SMTPSecure = "tls";
    //address used to send the email
    $mail->Username = "logiscool.sender@gmail.com";
    $mail->Password = "znopmieylbnymkwd";

    $mail->setFrom($email, $name);
    //address which receives the email
    $mail->addAddress("maria_mia00@yahoo.com");
    $mail->Subject = $subject;
    $mail->isHTML(true);
    $mail->Body = "Nume: $name <br> Email: $email<br> Numar de tel: $phone<br> Mesaj: $message";
    $mail->send();

    // Set the response parameter directly without using the URL
    $response = "sent";
  } catch (Exception $e) {
    // Set the response parameter directly without using the URL
    $response = "emailerror";
  }
}

// Redirect to the referring page with the response parameter
$url = $_SERVER['HTTP_REFERER'];
$url = setResponseUrl($url, $response);
header("Location: $url");
exit();

function setResponseUrl($url, $response) {
  $parsedUrl = parse_url($url);
  $query = isset($parsedUrl['query']) ? $parsedUrl['query'] : '';

  // Remove existing response parameter from query
  parse_str($query, $queryParams);
  $queryParams = array_filter($queryParams, function ($key) {
    return strpos($key, 'response=') !== 0;
  }, ARRAY_FILTER_USE_KEY);

  // Add new response parameter to query
  $queryParams['response'] = $response;

  // Build new URL with updated query parameters
  $parsedUrl['query'] = http_build_query($queryParams);
  return unparse_url($parsedUrl);
}

function unparse_url($parsed_url) {
  $scheme = isset($parsed_url['scheme']) ? $parsed_url['scheme'] . '://' : '';
  $host = isset($parsed_url['host']) ? $parsed_url['host'] : '';
  $port = isset($parsed_url['port']) ? ':' . $parsed_url['port'] : '';
  $user = isset($parsed_url['user']) ? $parsed_url['user'] : '';
  $pass = isset($parsed_url['pass']) ? ':' . $parsed_url['pass'] : '';
  $pass = ($user || $pass) ? "$pass@" : '';
  $path = isset($parsed_url['path']) ? $parsed_url['path'] : '';
  $query = isset($parsed_url['query']) ? '?' . $parsed_url['query'] : '';
  $fragment = isset($parsed_url['fragment']) ? '#' . $parsed_url['fragment'] : '';
  return "$scheme$user$pass$host$port$path$query$fragment";
}

?>
