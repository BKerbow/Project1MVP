let url = "http://localhost:8080/Project1/FrontController"

function reject(story){

    let rejection = {
        reason: document.getElementById("rejectReason").value
    };

    story.reason = rejection.reason;

    let json = JSON.stringify(story);
    console.log("json: " + json);

    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", url + "/reject_script", true);
    xhttp.send(json);

    xhttp.onreadystatechange = receiveData;

    function receiveData(){
        console.log(xhttp.responseText);
        window.location = "/Project1/editors.html";
    }
}

function getSavedStory(){
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", url + "/get_story_from_session", true);
    xhttp.send();

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4){
            if(xhttp.status == 200){
                let r = xhttp.responseText.split("|");
                let story = JSON.parse(r[1]);
                console.log(xhttp.responseText);
                document.getElementById("rejectButton").onclick = () => {
                    console.log("clicked submit");
                    reject(story);
                };
            }
        }
    }
}

function goBack(){
    window.location = "/Project1/editors.html";
}