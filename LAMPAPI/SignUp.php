<?php
	$inData = getRequestInfo();

	$firstName = "";
	$lastName = "";
	$login = "";
	$password = ""; 

	$conn = new mysqli("localhost", "fb", "123", "COP4331");

	if($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
	{
		$stmt = $conn->prepare("INSERT into Users (firstName, lastName, Login, Password) VALUES (?, ?, ?, ?)");
		$stmt->bind_param("ssss", $inData["firstName"], $inData["lastName"], $inData["Login"], $inData["Password"]);
		$stmt->execute();
		if($stmt->affected_rows > 0) // if successful
		{
			sendResultInfoAsJson("successful ^_^");
		}
		else
		{
			sendResultInfoAsJson("Unable to create account");
		}
		$stmt->close();
		$conn->close();

	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError($obj)
	{
		sendResultInfoAsJson($obj);
	}
	

?>




