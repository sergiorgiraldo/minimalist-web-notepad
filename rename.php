<?php
    $data = json_decode(file_get_contents('php://input'), true);
    $oldName = $data['oldName'];
    $newName = $data['newName'];

    if (rename($oldName, $newName)) {
        echo "File renamed successfully";
    } else {
        echo "There was a problem renaming the file";
    }
?>

