<?php

include "common.php";

  /**
   * Finish this web service to take a GET parameter called "type"
   * and print out the respective output
   */
  if (isset($_GET["type"])) {
    $db = get_PDO();
    $type = $_GET["type"];
    $output = delete_data($db);
    if (isset($output)) {
      header("Content-Type: application/json");
      print(json_encode($output));
    }
  } else {
    /**
     * Handles the 400 error of or
     */
    handle_user_error("No file was received, or the file was in wrong format.");
  }

  /**
   * Deletes all data and returns a success message along with the number of affected rows
   */
  function delete_data($db) {
    try {
      $sql = "DELETE FROM Analysis;";
      $stmt = $db->prepare($sql);
      $stmt->execute();
      $count = $stmt->rowCount();
      return array("success" => "All data removed from your database",
                   "rows" => $count
                  );
    } catch (PDOException $ex) {
      /**
       * Prints out the error message
       */
      handle_db_error("A database error occurred. Please try again later.");
    }
  }

?>
