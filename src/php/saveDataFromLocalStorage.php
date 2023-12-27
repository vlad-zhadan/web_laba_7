<?php 
	$data = json_decode(file_get_contents("php://input"));

	$conn = new mysqli("sql207.infinityfree.com", "if0_35685630", "ZeMZWBBVcXrFZ9", "if0_35685630_laba7");
	if ($conn->connect_error)
    	die("Connection failed: " . $conn->connect_error);
    
    $dataArray = $data->data;
    foreach ($dataArray as $item) {
    	$date = $item->date;
    	$number = $item->number;

		$sql= $conn->prepare("UPDATE messages SET localStorageDate=? WHERE number=?");
		$sql->bind_param("si", $date, $number);

		if($sql->execute())
			echo "Element from local storage saved\n";
		else
			echo "Saving error";
	}
	$conn->close();
?>