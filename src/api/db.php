<?php
    header("Content-Type: text/html; charset=utf-8");
    $host = "94.181.190.26";
    $user = "10v_skripko";
    $pass = "KamatQuyu--36i1";
    $dbname = "keytyper";

    $con = mysqli_connect($host, $user, $pass, $dbname);

    $method = $_SERVER['REQUEST_METHOD'];
    $request = explode('/', trim($_SERVER['PATH_INFO'], '/'));

    if (!$con) {
        die("Connection failed: " . mysqli_connect_error($con));
    }

    $sql = "select * from levels";

    $res = mysqli_query($con, $sql);

    if (!$res) {
        http_response_code(404);
        die(mysqli_error($con));
    }

    while ($row = mysqli_fetch_assoc($result)) {
        echo "id: " . $row["id"] . " | file: " . $row["filename"] . " | step: " . $row["step"] . "<br>";
    }

    mysqli_close($con);
?>