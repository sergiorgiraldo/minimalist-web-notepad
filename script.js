/*! Minimalist Web Notepad | https://github.com/pereorga/minimalist-web-notepad */

var simplemde = new SimpleMDE({
    status: false,
    toolbar:false,
    spellChecker: false,
    autofocus:true,
    
});

var scriptUrl = "https://www.example.com/contents.php";

// URL of the href
var hrefUrl = document.location.href;

fetch(scriptUrl + "?href=" + hrefUrl )
    .then(response => response.text())
    .then(data => {
        simplemde.value(data);
        simplemde.codemirror.refresh();
    })
    .catch((error) => {
        console.error('Error:', error);
    });


var spanDelete = document.querySelectorAll(".to-delete");
var spanRename = document.querySelectorAll(".to-rename");

var textarea = document.getElementById('content');
var printable = document.getElementById('printable');
var content = simplemde.value(); //textarea.value;

function handleDelete(href){
    var fullPathWithFilename = href.replace("https://www.example.com/", "/path/your/site/_tmp/");
    if(confirm("Delete this file?")){
        deleteFile(fullPathWithFilename);
    }
}

function deleteFile(oldName) {
    fetch("delete.php", {
        method: "POST",
        body: JSON.stringify({
            oldName: oldName
        }),
        headers: {
            "Content-type": "application/json"
        }
    })
    .then(response => response.text())
    .then(data => {
            console.log(data);
            window.location.replace("https://www.example.com/");
        }
    )
    .catch(error => console.error('Error:',error))
}

function handleRename(href){
    var rootDirectory = "/path/your/site/_tmp";
    var splitHref = href.split("/");
    var fullPathWithFilename = href.replace("https://www.example.com/", "/path/your/site/_tmp/");
    var filename = splitHref[splitHref.length - 1];
    var userInput = prompt("New name", filename);
    if (userInput == null || userInput == "") {
        return;
    } 
    else {
        var newHref = href.replace(filename, userInput);
        var newFullPathWithFilename = fullPathWithFilename.replace(filename, userInput);
        renameFile(fullPathWithFilename, newFullPathWithFilename, newHref);
    }
}

function renameFile(oldName, newName, location) {
    fetch("rename.php", {
        method: "POST",
        body: JSON.stringify({
            oldName: oldName,
            newName: newName
        }),
        headers: {
            "Content-type": "application/json"
        }
    })
    .then(response => response.text())
    .then(data => {
            console.log(data);
            window.location.replace(location);
        }
    )
    .catch(error => console.error('Error:',error))
}

function uploadContent() {
    var updated = simplemde.value();
    if (content !== updated) {
        var temp = updated;
        var request = new XMLHttpRequest();
        request.open('POST', window.location.href, true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.onload = function() {
            if (request.readyState === 4) {

                // If the request has ended, check again after 1 second.
                content = temp;
                setTimeout(uploadContent, 1000);
            }
        }
        request.onerror = function() {

            // Try again after 1 second.
            setTimeout(uploadContent, 1000);
        }
        request.send('text=' + encodeURIComponent(temp));

        // Update the printable contents.
        printable.removeChild(printable.firstChild);
        printable.appendChild(document.createTextNode(temp));
    }
    else {

        // If the content has not changed, check again after 1 second.
        setTimeout(uploadContent, 1000);
    }
}

spanDelete.forEach(function(span) {
    span.addEventListener("click", function(event){
        event.preventDefault();
        handleDelete(span.dataset.href);
    });
});


spanRename.forEach(function(span) {
    span.addEventListener("click", function(event){
        event.preventDefault();
        handleRename(span.dataset.href);
    });
});


document.getElementById("toggle").addEventListener("click", function(event){
    event.preventDefault();
    var elLeft = document.getElementsByClassName('left')[0];
    var elRight = document.getElementsByClassName('right')[0];

    if (elLeft.style.display=='none'){
        elLeft.style.display='block';
        elRight.style.width='85%';
    } 
    else {
        elLeft.style.display='none';
        elRight.style.width='100%';
    }
});

// Initialize the printable contents with the initial value of the textarea.
printable.appendChild(document.createTextNode(content));

uploadContent();