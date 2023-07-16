<?php
    $data = json_decode(file_get_contents('php://input'), true);
    $oldName = $data['oldName'];

    function deleteFolder($dir) {
        if (is_dir($dir)) {
            $objects = scandir($dir);
            foreach ($objects as $object) {
                if ($object != "." && $object !="..") {
                    if (filetype($dir."/".$object) == "dir") {
                        deleteFolder($dir."/".$object);    
                    } else {
                        unlink($dir."/".$object);
                    }
                }
            }
            reset($objects); // Reset the array pointer
            rmdir($dir);
        }
    }

    if (is_dir($oldName)) {
        deleteFolder($oldName);
    }
    else{    
        if (unlink($oldName)) {
            echo "File deleted successfully";
        } else {
            echo "There was a problem deleting the file";
        }
    }
?>

