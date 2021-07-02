let url = "http://localhost:8080/Project1/FrontController"

function submit(story){

    let newDraft = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        tagLine: document.getElementById("tag_line").value,
        submissionDate: document.getElementById("submission_date").value,
        draft: document.getElementById("draft").value,
        modified: true
    };

    story.title = newDraft.title;
    story.description = newDraft.description;
    story.tagLine = newDraft.tagLine;
    story.completionStatus = newDraft.completionStatus;
    story.submissionDate = newDraft.submissionDate;
    story.draft = newDraft.draft;
    story.modified = newDraft.modified;
    
    console.log("login info:" + newDraft);
    let json = JSON.stringify(story);
    console.log("json: " + json);

    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", url + "/submit_draft_update", true);
    xhttp.send(json);

    xhttp.onreadystatechange = receiveData;

    function receiveData(){
        console.log("The xhttp ready state is: " + xhttp.readyState);
        console.log("The xhttp status is: " + xhttp.status);
        console.log(xhttp.responseText);
        console.log("Switching to authors.html!");
        //window.location = "/Project1/authors.html";
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
    window.location = "/Project1/authors.html";
}