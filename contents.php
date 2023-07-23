<?php
    header('Content-Type: text/plain');
    
    if(isset($_GET['href'])) {
        $href = $_GET['href'];
        
        $filePath = str_replace('https://www.example.com/', '/path/your/site/_tmp/', $href);
        
        if(file_exists($filePath)) {
            $fileContent = file_get_contents($filePath);

            echo $fileContent;
        } else {
            echo "";
        }
    } else {
        echo "Invalid request.";
    }
?>
