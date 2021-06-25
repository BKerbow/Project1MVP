let url = "http://localhost:8080/Project1/FrontController"

function submit(story){

    let infoRequest = document.getElementById("infoReqest");
    let jsons = [story, infoRequest.value];
    let json = JSON.stringify(jsons);
    
    console.log("json: " + json);
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", url + "/post_info_request", true);
    xhttp.send(json);
    console.log(json);
    
    xhttp.onreadystatechange = postData;
    
    function postData(){
        console.log(xhttp.responseText);
       if(xhttp.readyState == 4){
           if(xhttp.status == 200){
               console.log("Json is packed and ready to send.");
               console.log(xhttp.responseText);
               window.location.href = "/Project1/editors.html";
           }
        }
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
                document.getElementById("submitButton").onclick = () => {
                    console.log("clicked submit");
                    submit(story);
                };
            }
        }
    }
}

function goBack(){
    window.location = "/Project1/editors.html";
}
