let url = "http://localhost:8080/Project1/FrontController"

function submit(message){

    console.log(message);
    let json = JSON.stringify(message);
    console.log("json: " + json);
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", url + "/post_info_response", true);
    xhttp.send(json);
    console.log(json);
    
    xhttp.onreadystatechange = postData;
    
    function postData(){
        console.log(xhttp.responseText);
       // window.location  = "/Project1/editors.html"
    }
}

function getSavedMessage(){
    let xhttp = new XMLHttpRequest(); //below is get message from author side
    xhttp.open("GET", url + "/get_message_from_session", true);
    xhttp.send();

    xhttp.onreadystatechange = () => {
        console.log(xhttp.responseText);
        if (xhttp.readyState == 4){
            if(xhttp.status == 200){
                //let r = xhttp.responseText.split("|");
                let message = JSON.parse(xhttp.responseText);
                console.log(xhttp.responseText);
                document.getElementById("submitButton").onclick = () => {
                    message.authorMessage = document.getElementById("authorResponse").value;
                    console.log("clicked submit");
                    submit(message);
                }
            }
        }
    }
}

function goBackEditor(){
    window.location = "/Project1/editors.html";
}
