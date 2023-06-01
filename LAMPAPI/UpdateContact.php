<?php
	$indata = getRequestInfo();

	$firstName = $indata["firstName"];
	$lastName= $indata["lastName"];
	$phone= $indata["phone"];
	$Email= $indata["Email"];
	$ID = $indata["ID"]; #this is the ID of the contact that we need to change, id should never be null 

	$conn = new mysqli("localhost", "fb", "123", "COP4331");
	if(empty($firstName))
	{
		$stmt = $conn->prepare("SELECT FirstName FROM Contacts WHERE ID=?");
		$stmt->bind_param("s", $indata["ID"]);
		$stmt->execute();
		$result = $stmt->get_result();
		if($row = $result->fetch_assoc())
		{
			$firstName = $row["FirstName"];
		}


	}

	if(empty($lastName))
	{
		$stmt = $conn->prepare("SELECT * FROM Contacts WHERE ID=?");
		$stmt->bind_param("s", $indata["ID"]);
		$stmt->execute();
		if($row = $stmt->get_result()->fetch_assoc())
		{
			$lastName = $row['LastName'];
		}


	}
	if(empty($Email))
	{
		$stmt = $conn->prepare("SELECT * FROM Contacts WHERE ID=?");
		$stmt->bind_param("s", $indata["ID"]);
		$stmt->execute();
		if($row = $stmt->get_result()->fetch_assoc())
		{
			$Email = $row['Email'];
		}


	}
	if(empty($phone))
	{
		$stmt = $conn->prepare("SELECT * FROM Contacts WHERE ID=?");
		$stmt->bind_param("s", $indata["ID"]);
		$stmt->execute();
		if($row = $stmt->get_result()->fetch_assoc())
		{
			$phone = $row['Phone'];
		}


	}
	$stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Email=?, Phone=? WHERE ID=?");
	$stmt->bind_param("sssss", $firstName, $lastName, $Email, $phone, $ID);
	$stmt->execute();
	//if($row = $stmt->fetchColumn())
	//{
	returnWithInfo($firstName,$lastName,$Email,$phone, $indata['firstName'],$indata['lastName'],$indata['Email'],$indata['phone']);
	//}
	$stmt->close();
	$conn->close();

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}
	function sendResultInfoAsJson($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithInfo($firstname, $lastName, $email, $phone, $oldfirst, $oldlast, $oldemail,$oldphone)
	{
//		$ret1 = '{"old firstName": ' . $oldfirst . ',"old lastName":"' . $oldlast . '"," old email":"' . $oldemail . '","old phone":"' . $oldphone . '"}';
	//	sendResultInfoAsJson($ret1);
		$ret1 = '{"new firstName": ' . $firstname . ',"new lastName":"' . $lastName . '"," new email":"' . $email . '","new phone":"' . $phone . '"}';
		sendResultInfoAsJson($ret1);
	}



?>
