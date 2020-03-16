<?php

  /**
   * Returns a PDO object connected to the database. If a PDOException is thrown when
   * attempting to connect to the database, responds with a 503 Service Unavailable
   * error.
   * @return {PDO} connected to the database upon a succesful connection.
   */
  function get_PDO() {
    # Variables for connections to the database.
    # TODO: Replace with your server (e.g. MAMP) variables as shown in lecture on Friday.
    $host = "localhost";     # fill in with server name (e.g. localhost)
    $port = "8889";     # fill in with a port if necessary (will be different mac/pc)
    $user = "root";     # fill in with user name
    $password = "root"; # fill in with password (will be different mac/pc)
    $dbname = "analyze";   # fill in with db name containing your SQL tables

    # Make a data source string that will be used in creating the PDO object
    $ds = "mysql:host={$host}:{$port};dbname={$dbname};charset=utf8";

    try {
      $db = new PDO($ds, $user, $password);
      $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      return $db;
    } catch (PDOException $ex) {
      # TODO: You must handle a DB error (503 Service Unavailable) if an error occurs.
      handle_db_error("A database error occurred. Please try again later.");
    }
  }

  /**
   * Prints out a plain text 503 error message given $msg. If given a second (optional) argument as
   * a PDOException, prints details about the cause of the exception. See process_error for
   * note about responding with PDO errors to a client.
   * @param $msg {string} - Plain text 503 message to output
   */
  function handle_db_error($msg) { # we can do default parameters in PHP! NULL is default if not given a second parameter.
    process_error("HTTP/1.1 503 Service Unavailable", $msg);
  }

  /**
   * Prints out a plain text 400 error message given $msg. If given a second (optional) argument as
   * a PDOException, prints details about the cause of the exception. See process_error for
   * note about responding with PDO errors to a client.
   * @param $msg {string} - Plain text 400 message to output
   */
  function handle_user_error($msg) {
    process_error("HTTP:1.1 400 Service Unavailable", $msg);
  }

   /**
    * Prints out a json error message given $msg after sending the given header (handy
    * to factor out error-handling between 400 request errors and 503 db errors).
    *
    * @param $type {string} - The HTTP error header string.
    * @param $msg {string} - Plain text message to output.
    */
  function process_error($type, $msg) {
    header($type);
    header("Content-type: application/json");
    $error = array("error" => $msg);
    die(json_encode($error));
  }

?>
