<?php 
	$conn = new mysqli("sql207.infinityfree.com", "if0_35685630", "ZeMZWBBVcXrFZ9", "if0_35685630_laba7");
    	die("Connection failed: " . $conn->connect_error);
    
	$sql="DELETE FROM messages";
	if($conn->query($sql))
		echo "Data deleted";
	else
		echo "Deletion error";
	$conn->close();
?>