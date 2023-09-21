<?php
require __DIR__ . "/CoordinatesValidator.php";
require __DIR__ . "/AreaChecker.php";
@session_start();

if (!isset($_SESSION["results"])) {
    $_SESSION["results"] = array();
}


if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);
    return;
}


$x = (float)$_GET["x"];
$y = (float)$_GET["y"];
$r = (float)$_GET["r"];


$validator = new CoordinatesValidator($x, $y, $r);


if ($validator->checkData()) {
    $isInArea = AreaChecker::isInArea($x, $y, $r);
    $coordsStatus = $isInArea ? "Попал" : "Промазал";
    $currentTime = date('Y-m-d H:i:s');
    $benchmarkTime = microtime(true) - $_SERVER["REQUEST_TIME_FLOAT"];
    $newResult = array(
        "x" => $x,
        "y" => $y,
        "r" => $r,
        "coordsStatus" => $coordsStatus,
        "currentTime" => $currentTime,
        "benchmarkTime" => $benchmarkTime
    );

    array_push($_SESSION["results"], $newResult);

    $tableHTML = "<table id='outputTable'>
            <tr>
                <th>x</th>
                <th>y</th>
                <th>r</th>
                <th>Точка входит в ОДЗ</th>
                <th>Текущее время</th>
                <th>Время работы скрипта</th>
            </tr>";

    foreach (array_reverse($_SESSION["results"]) as $tableRow) {
        $tableHTML .= "<tr>";
        $tableHTML .= "<td>" . $tableRow["x"] . "</td>";
        $tableHTML .= "<td>" . $tableRow["y"] . "</td>";
        $tableHTML .= "<td>" . $tableRow["r"] . "</td>";
        $tableHTML .= "<td>" . $tableRow["coordsStatus"] . "</td>";
        $tableHTML .= "<td>" . $tableRow["currentTime"] . "</td>";
        $tableHTML .= "<td>" . $tableRow["benchmarkTime"] . "</td>";
        $tableHTML .= "</tr>";
    }

    $tableHTML .= "</table>";

    echo $tableHTML; 
} else {
    http_response_code(400);
    return;
}
?>