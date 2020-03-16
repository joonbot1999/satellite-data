<?php

    include "common.php";

    // Part 1: Satellite types
    if (isset($_GET["type"])) {
      $db = get_PDO();
      $time_num_array = array();
      $sat_type = $_GET["type"];
      header("Content-Type: application/json");
      print(json_encode(sat_array($db, $time_num_array, $sat_type)));
    // Part 2: Rows in a database
    } else if (isset($_GET["points"])) {
      $db = get_PDO();
      header("Content-Type: application/json");
      print(json_encode(fetch_rows($db)));
    } else {
      handle_user_error("The request has unidentified type, or has missing parameter(s)");
    }

    // Makes satellite arrays depending on a user input
    function sat_array($db, $time_num_array, $sat_type) {
      try {
        if ($sat_type === "russia") {
          $sql = "SELECT `Times`, `Satellite`, `Type` FROM `analysis` WHERE `Type` > 200";
        } else if ($sat_type === "usa") {
          $sql = "SELECT `Times`, `Satellite`, `Type` FROM `analysis` WHERE `Type` < 200";
        } else if ($sat_type === "all") {
          $sql = "SELECT `Times`, `Satellite`, `Type` FROM `analysis`";
        }
        $rows = $db->query($sql);
        while ($row = $rows->fetch(PDO::FETCH_ASSOC)) {
          array_push($time_num_array, $row);
        }
        $fin_array = array("Information" => $time_num_array);
        return $fin_array;
      } catch (PDOException $ex) {
        /**
         * Prints out the error message
         */
        handle_db_error("A database error occurred. Please try again later.");
      }
    }

    // Fetch the current number of rows in a database
    function fetch_rows($db) {
      try {
        $sql = "SELECT COUNT(*) FROM Analysis";
        $rows = $db->query($sql);
        return($rows->fetch(PDO::FETCH_ASSOC));
      } catch (PDOException $ex) {
        /**
         * Prints out the error message
         */
        handle_db_error("A database error occurred. Please try again later.");
      }
    }
 ?>
