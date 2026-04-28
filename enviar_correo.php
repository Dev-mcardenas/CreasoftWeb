<?php
// enviar_correo.php
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitizar y validar los datos recibidos
    $nombre = strip_tags(trim($_POST["nombre"] ?? ''));
    $empresa = strip_tags(trim($_POST["empresa"] ?? ''));
    $email = filter_var(trim($_POST["email"] ?? ''), FILTER_SANITIZE_EMAIL);
    $telefono = strip_tags(trim($_POST["telefono"] ?? ''));
    $servicio = strip_tags(trim($_POST["servicio"] ?? ''));
    $mensaje = strip_tags(trim($_POST["mensaje"] ?? ''));

    // Validar campos requeridos
    if (empty($nombre) || empty($email) || empty($telefono)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Por favor, completa los campos obligatorios."]);
        exit;
    }

    // Configuración del correo
    $destinatario = "alejandroloche1234@gmail.com";
    $asunto = "Nueva Solicitud de Asesoría - Creasoft";

    // Cuerpo del correo
    $contenido = "Has recibido una nueva solicitud de asesoría desde la página web.\n\n";
    $contenido .= "Nombres y Apellidos: $nombre\n";
    $contenido .= "Empresa: $empresa\n";
    $contenido .= "Correo Electrónico: $email\n";
    $contenido .= "Número de Celular: $telefono\n";
    $contenido .= "Servicio de Interés: $servicio\n";
    $contenido .= "Mensaje:\n$mensaje\n";

    // Cabeceras del correo
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // Enviar el correo
    if (mail($destinatario, $asunto, $contenido, $headers)) {
        http_response_code(200);
        echo json_encode(["status" => "success", "message" => "¡Mensaje enviado con éxito! Nos pondremos en contacto pronto."]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Ocurrió un error al enviar el correo. Por favor intenta más tarde."]);
    }
} else {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Acceso denegado."]);
}
?>
