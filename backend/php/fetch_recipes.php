<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'config.php';

// Load the CSV file
$csvFile = 'path/to/your/recipes.csv'; // Update this path
$recipes = [];

if (($handle = fopen($csvFile, 'r')) !== FALSE) {
    // Get the headers from the first row
    $headers = fgetcsv($handle);

    // Read each row of the CSV
    while (($data = fgetcsv($handle)) !== FALSE) {
        // Combine headers and data into an associative array
        $recipe = array_combine($headers, $data);

        // If array_combine fails, it returns false
        if ($recipe === false) {
            echo json_encode(["error" => "CSV format issue."]);
            exit();
        }

        // Add the recipe to the list
        $recipes[] = $recipe;
    }

    fclose($handle);
}

echo json_encode($recipes);
$conn->close();
?>