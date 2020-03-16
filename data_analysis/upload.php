<?php

include "common.php";

// Changes the maximum runtime to 5 minutes
ini_set('max_execution_time', 300);

  // Input type of file
  if (isset($_FILES['file'])) {
    // Handles file error(no file input or incorrect file type)
    if ($_FILES['file']['error'] > UPLOAD_ERR_OK) {
      handle_user_error("No file was received, or the file was in wrong format.");
    }
    $db = get_PDO();
    $file = $_FILES['file'];
    $document = file($file["name"]);
    $count = 0;
    for ($i = 0; $i < count($document); $i++) {
      $count++;
      $new_array = explode(",", $document[$i]);
      upload($new_array, $db);
    }
    header("Content-type: application/json");
    // If count corresponds to the number of rows
    if ($count === count($document)) {
      $success = array("success" => "Your file was successfully uploaded to the database.");
      print(json_encode($success));
    // Usually when a runtime error happens
    } else {
      $error = array("error" => "Something prevented the program from adding the file to a server.");
      print(json_encode($error));
    }
  // Handles file error(no file input or incorrect file type)
  } else if ($_FILES['file']['error'] > UPLOAD_ERR_OK){
    handle_user_error("No file was received, or the file was in wrong format.");
  }

  // Uploads data into a server
  function upload($new_array, $db) {
    try {
      $Times = $new_array[0];
      $Satellite = $new_array[1];
      $Type = $new_array[2];
      // SQL
      $sql = "INSERT INTO `Analysis`(`Times`, `Satellite`, `Type`)" .
             "Value(:Times, :Satellite, :Type);";
      $stmt = $db->prepare($sql);
      $params = array(
        "Times" => $Times,
        "Satellite" => $Satellite,
        "Type" => $Type
      );
      $stmt->execute($params);
    } catch (PDOException $ex){
      handle_db_error("A database error occurred. Please try again later.");
    }
  }

?>
