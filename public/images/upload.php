<?php
    $filename = $_FILES['file']['name'];

    $location = $filename;

    if(move_uploaded_file($_FILES['file']['temp_name'], $location))
    {
        echo "success";
    }
    else
    {
        echo "fail";
    }
?>