<?php 
	$data = json_decode(file_get_contents("php://input"));

	$conn = new mysqli("sql207.infinityfree.com", "if0_35685630", "ZeMZWBBVcXrFZ9", "if0_35685630_laba7");
	if ($conn->connect_error)
    	die("Connection failed: " . $conn->connect_error);
    
    $messageNumber = $data->number;
    $message = $data->message;
    date_default_timezone_set("Europe/Kiev");		
    $currentDateTime = date("Y-m-d H:i:s");

	$sql="INSERT INTO messages(number, date, message) VALUES('$messageNumber', '$currentDateTime', '$message');";
	if($conn->query($sql))
		echo "Data saved";
	else
		echo "Saving error";
	$conn->close();
?>