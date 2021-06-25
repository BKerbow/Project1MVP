let url = 'http://localhost:8080/Project1/FrontController';

function authorLogin(){
    //Everything happening here (outside of onreadystatechange) prepares data and sends it to server
    console.log("logging in...");

    let authorLogIn = {
        username: document.getElementById("authorUsername").value,
        password: document.getElementById("authorPassword").value
    };

    console.log("login info:" + authorLogIn);
    let json = JSON.stringify(authorLogIn);
    console.log("json: " + json);

    let xhttp = new XMLHttpRequest();

    xhttp.open("POST", url + "/author_login", true);
    xhttp.send(json);

    console.log("sent json");
    console.log("The xhttp ready state is: " + xhttp.readyState);
    console.log("The xhttp status is: " + xhttp.status);

    xhttp.onreadystatechange = receiveData;
    
    function receiveData(){
        console.log("The xhttp ready state is: " + xhttp.readyState);
        console.log("The xhttp status is: " + xhttp.status);
        if (xhttp.readyState == 4){
            if(xhttp.status == 200){
                //test to see if javascript is talking
                console.log("Request is ready and sending.");
                //load new html page sent from servlet
                console.log(xhttp.responseText);
                window.location.href = xhttp.responseText;
                console.log("Switching to authors.html!");
            }
        }
    }
}

function editorLogin(){
    //Everything happening here (outside of onreadystatechange) prepares data and sends it to server
    console.log("logging in...");

    let editorLogIn = {
        username: document.getElementById("editorUsername").value,
        password: document.getElementById("editorPassword").value
    };

    console.log("login info:" + editorLogIn);
    let json = JSON.stringify(editorLogIn);
    console.log("json: " + json);

    let xhttp = new XMLHttpRequest();

    xhttp.open("POST", url + "/editor_login", true);
    xhttp.send(json);

    console.log("sent json");
    console.log("The xhttp ready state is: " + xhttp.readyState);
    console.log("The xhttp status is: " + xhttp.status);

    xhttp.onreadystatechange = receiveData;
    
    function receiveData(){
        console.log("The xhttp ready state is: " + xhttp.readyState);
        console.log("The xhttp status is: " + xhttp.status);
        if (xhttp.readyState == 4){
            if(xhttp.status == 200){
                //test to see if javascript is talking
                console.log("Request is ready and sending.");
                //load new html page sent from servlet
                console.log(xhttp.responseText);
                window.location.href = xhttp.responseText;
                console.log("Switching to editors.html!");
            }
        }
    }
}

function authorSignUp(){{
    //Everything happening here (outside of onreadystatechange) prepares data and sends it to server
    console.log("signing up...");

    let authorSignUp = {
    firstName: document.getElementById("first_name").value,
    lastName: document.getElementById("last_name").value,
    bio: document.getElementById("sign_up_bio").value,
    username: document.getElementById("newAuthorUsername").value,
    password: document.getElementById("newAuthorPassword").value
    };
    
    console.log("login info:" + authorSignUp);
    let json = JSON.stringify(authorSignUp);
    console.log("json: " + json);
    
    let xhttp = new XMLHttpRequest();
    
    xhttp.open("POST", url + "/author_signup", true);
    xhttp.send(json);
    
    console.log("sent json");
    console.log("The xhttp ready state is: " + xhttp.readyState);
    console.log("The xhttp status is: " + xhttp.status);
    
    xhttp.onreadystatechange = receiveData;
        
    function receiveData(){
        console.log("The xhttp ready state is: " + xhttp.readyState);
        console.log("The xhttp status is: " + xhttp.status);
        if (xhttp.readyState == 4){
            if(xhttp.status == 200){
                //test to see if javascript is talking
                console.log("Request is ready and sending.");
                //load new html page sent from servlet
                console.log(xhttp.responseText);
                window.location.href = xhttp.responseText;
                console.log("Switching to authors.html!");
            }
        }
    }
}

function editorSignUp(){
    //Everything happening here (outside of onreadystatechange) prepares data and sends it to server
    console.log("signing up...");

    let editorSignUp = {
    firstName: document.getElementById("edditor_first_name").value,
    lastName: document.getElementById("editor_last_name").value,
    username: document.getElementById("newEditorUsername").value,
    password: document.getElementById("newEditorPassword").value
    };
    
    console.log("login info:" + editorSignUp);
    let json = JSON.stringify(editorSignUp);
    console.log("json: " + json);
    
    let xhttp = new XMLHttpRequest();
    
    xhttp.open("POST", url + "/editor_signup", true);
    xhttp.send(json);
    
    console.log("sent json");
    console.log("The xhttp ready state is: " + xhttp.readyState);
    console.log("The xhttp status is: " + xhttp.status);
    
    xhttp.onreadystatechange = receiveData;
        
    function receiveData(){
        console.log("The xhttp ready state is: " + xhttp.readyState);
        console.log("The xhttp status is: " + xhttp.status);
        if (xhttp.readyState == 4){
            if(xhttp.status == 200){
                //test to see if javascript is talking
                console.log("Request is ready and sending.");
                //load new html page sent from servlet
                console.log(xhttp.responseText);
                window.location.href = xhttp.responseText;
                console.log("Switching to authors.html!");
            }
        }
    }

}}