<?php
	$inData = getRequestInfo();
		
	$userId = $inData["userId"];
	$contactId = $inData["contactId"];

	$conn = new mysqli("localhost", "fb", "123", "COP4331"); 

	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("delete from Contacts where UserID=? and ID=?");
		$stmt->bind_param("ss", $userId, $contactId);
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