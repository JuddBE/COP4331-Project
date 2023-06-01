<?php
	$inData = getRequestInfo();
	
	if ($inData == null)
	{
		sendResultInfoAsJson('{inData is not null}');
	}

	$userId = $inData["userId"];
    $firstName = $inData["fistName"];
    $lastName = $inData["lastName"];
    $email = $inData["email"]
    $phone = $inData["phone"];
    $dateCreated = $inData["dateCreated"];

	$conn = new mysqli("localhost", "fb", "123", "COP4331"); 
	//$conn = new mysqli("localhost", "Judd", "LetsG0Gamers", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("INSERT into Contacts (UserId,Name) VALUES(?,?,?,?,?,?)");
		$stmt->bind_param("ssssss", $userId, $firstName, $lastName, $email, $phone, $dateCreated);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
?>
