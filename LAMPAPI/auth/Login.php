<?php
/*
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
*/

	$inData = getRequestInfo();
	
	$ID = 0;
	$FirstName = "";
	$LastName = "";

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "Nutrition");
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("SELECT ID,FirstName,LastName FROM Users WHERE Login=? AND BINARY Password =?");
		if (!$stmt)
		{
			$conn->close();
			returnWithError($conn->error);
			exit();
		}
		$loginValue = isset($inData["Login"]) ? $inData["Login"] : (isset($inData["login"]) ? $inData["login"] : "");
		$passwordValue = isset($inData["Password"]) ? $inData["Password"] : (isset($inData["password"]) ? $inData["password"] : "");
		$stmt->bind_param("ss", $loginValue, $passwordValue);
		$stmt->execute();
		$stmt->bind_result($ID, $FirstName, $LastName);

		if ($stmt->fetch())
		{
			returnWithInfo($FirstName, $LastName, $ID);
		}
		else
		{
			returnWithError("No Records Found");
		}

		$stmt->close();
		$conn->close();
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
		$retValue = '{"id":0,"FirstName":"","LastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
		exit();
	}
	
	function returnWithInfo( $FirstName, $LastName, $ID )
	{
		$retValue = '{"id":' . $ID . ',"FirstName":"' . $FirstName . '","LastName":"' . $LastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>