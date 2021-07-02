let url = "http://localhost:8080/Project1/FrontController"

function submit(){
    let authorSubmit = {
        title: document.getElementById('title').value,
        genre: document.getElementById("genre").value,
        storyType: document.getElementById("story_type").value,
        description: document.getElementById("description").value,
        tagLine: document.getElementById("tag_line").value,
        completionStatus: document.getElementById("completion_status").value,
        submissionDate: document.getElementById("submission_date").value
    };

    //story.title = authorSubmit.title;
    //story.genre = authorSubmit.genre;
    //story.storyType = authorSubmit.storyType;
    //storyDescription = authorSubmit.storyDescription.
    //story.tagLine = authorSubmit.tagLine;
    //story.completionStatus = authorSubmit.completionStatus;
    //story.submissionDate = authorSubmit.submissionDate;

    console.log("new story info: " + authorSubmit);
    let json = JSON.stringify(authorSubmit);
    console.log("json: " + json);

    let xhttp = new XMLHttpRequest();

    xhttp.open("POST", url + "/submit_story_form", true);
    xhttp.send(json);

    console.log(json);

    xhttp.onreadystatechange = receiveData;

    function receiveData(){
        console.log("the xhttp ready state is: " + xhttp.readyState);
        console.log("the xhttp status is: " + xhttp.status);
        if (xhttp.readyState == 4){
            if(xhttp.status == 200){
                console.log("Json is packed and ready to send.");
                console.log(xhttp.responseText);
               // window.location.href = "/Project1/authors.html";
                console.log("Going back to main author menu!");
            }
        }
    }
}

function goBack(){
    window.location = "/Project1/authors.html";
}