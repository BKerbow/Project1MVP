let url = "http://localhost:8080/Project1/FrontController"
let updateClicked = false;

function displayStories(){
    console.log("displaying author's stories");
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", url + "/get_author_stories", true);
    xhttp.send();
    console.log(xhttp.responseText);

    let dataSection = document.getElementById('storyData');
        dataSection.innerHTML = '';

    xhttp.onreadystatechange = () => {
        console.log(xhttp.readyState);
        console.log(xhttp.status);
        if(xhttp.readyState == 4){
            if(xhttp.status == 200){

                let dataSection = document.getElementById('storyData');
                dataSection.innerHTML = '';

                let strs = xhttp.responseText.split("|");
                logged_in = strs[0];
                let stories = JSON.parse(strs[1]);

                //create table
                let authorTable = document.createElement('table');
                authorTable.id = 'authorTable';
                for (let story of stories){

                    //create table header row
                    let thRow = document.createElement('tr');
                    let tHeaders = ['Title', 'Genre', 'Story Type', 'Description',
                                    'Tag Line', 'Completion Date', 'Approval Status', 'Reason'];
                    for (let h of tHeaders){
                        let th = document.createElement('th');
                        th.innerHTML = h;
                        thRow.appendChild(th);
                    }

                    authorTable.append(thRow);

                    //Iterate through the stories and create a table row with the date we want
                    //for (story of stories){
                    let tr = document.createElement('tr');

                    //Title
                    let tdTitle = document.createElement('td');
                    tdTitle.innerHTML = story.title;
                    tr.appendChild(tdTitle);

                    //Genre
                    let tdGenre = document.createElement('td');
                    tdGenre.innerHTML = story.genre.name;
                    tr.appendChild(tdGenre);

                    //Story Type
                    let tdStoryType = document.createElement('td');
                    tdStoryType.innerHTML = story.type.name;
                    tr.appendChild(tdStoryType);

                    //Description
                    let tdDescription = document.createElement('td');
                    tdDescription.innerHTML = story.description;
                    tr.appendChild(tdDescription);

                    //Tag Line
                    let tdTagLine = document.createElement('td');
                    tdTagLine.innerHTML = story.tagLine;
                    tr.appendChild(tdTagLine);

                    //Completion Date
                    let tdCompletionDate = document.createElement('td');
                    tdCompletionDate.innerHTML = story.completionDate;
                    tr.appendChild(tdCompletionDate);
                        
                    //Approval Status
                    let tdApprovalStatus = document.createElement('td');
                    tdApprovalStatus.innerHTML = story.approvalStatus;
                    tr.appendChild(tdApprovalStatus);

                    //Update Button
                    let tdButton = document.createElement('button');
                    tdButton.innerHTML = 'Update';
                    tr.appendChild(tdButton);

                    tdButton.onclick = () => { updateStory(story); }

                    console.log(strs[1]);
                    authorTable.appendChild(tr);
                    authorTable.setAttribute("border", 2);
                        
                    dataSection.appendChild(authorTable);
                }
            }
        }
    }
}

function updateStory(story){
    let xhttp = new XMLHttpRequest()
    xhttp.open("POST", url + "/save_story_to_session", true);
    xhttp.send(JSON.stringify(story));

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState = 4){
            if (xhttp.status == 200){
                console.log("saved story!");
                window.location.href = "newdraft.html";
            }
        }
    }
}


function getEditorMessages(){
    console.log("displaying editor's messages");
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", url + "/get_editor_messages", true);
    xhttp.send();
    console.log(xhttp.responseText);

    let dataSection = document.getElementById('editorMessageData');
    dataSection.innerHTML = '';

    xhttp.onreadystatechange = () => {
        console.log(xhttp.readyState);
        console.log(xhttp.status);
        if(xhttp.readyState == 4){
            if(xhttp.status == 200){
            
                let dataSection = document.getElementById('editorMessageData');
                dataSection.innerHTML = '';

                let msgs = xhttp.responseText.split("|");
                logged_in = JSON.parse(msgs[1]);
                let messages = JSON.parse(msgs[0]);

                //create table
                let messageTable = document.createElement('table');
                messageTable.id = 'messageTable';

                console.log(messages)
                for (let message of messages){
                    //create table header row
                    let thRow = document.createElement('tr');
                    let tHeaders = ['Title', 'From Editor', 'Editor Message'];
                    for (let h of tHeaders){
                        let th = document.createElement('th');
                        th.innerHTML = h;
                        thRow.appendChild(th);
                    }

                    messageTable.append(thRow);

                    //Iterate through the stories and create a table row with the date we want
                    let tr = document.createElement('tr');

                    //Title of Work
                    let tdTitle = document.createElement('td');
                    tdTitle.innerHTML = message.title.title;
                    console.log("appending title table data");
                    tr.appendChild(tdTitle);

                    //Editor's Name
                    let tdEditor = document.createElement('td');
                    tdEditor.innerHTML = message.fromEditor.firstName;
                    tr.appendChild(tdEditor);

                    //Editor's Message
                    let tdEditorMessage = document.createElement('td');
                    tdEditorMessage.innerHTML = message.editorMessage;
                    tr.appendChild(tdEditorMessage);

                    // //Reply to Editor Message
                    // let tdReplyButton = document.createElement('button');
                    // tdReplyButton.innerHTML = 'Update';
                    // tr.appendChild(tdReplyButton);

                    // tdReplyButton.onclick = function sendRequestReply(){
                    //     console.log("button pressed");
                    //     let json = JSON.stringify(message)
                    //     console.log("json: " + json);

                    //     let xhttp = new XMLHttpRequest();
                    //     xhttp.open("POST", url + "/save_message_to_session", true);
                    //     xhttp.send(json);

                    //     console.log("sent json");
                    //     xhttp.onreadystatechange = sendInfoData;

                    //     function sendInfoData(){
                    //         if(xhttp.readyState == 4){
                    //             if(xhttp.status == 200){
                    //                 if(xhttp.responseText == 'saved'){
                    //                     console.log("saved story!");
                    //                     window.location.href = "authorresponse.html";
                    //                 }
                    //             }
                    //         }
                    //     }
                    // }
                   
                    messageTable.appendChild(tr);
                    dataSection.appendChild(messageTable);
                }
            }
        }
    }
}

function submitStory(){
    window.location = "/Project1/newwork.html";
}

function logout(){
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", url + "/logout", true);
    xhttp.send();

    xhttp.onreadystatechange = receiveData;

    function receiveData(){
        console.log("The xhttp ready state is: " + xhttp.readyState);
        console.log("The xhttp status is: " + xhttp.status);
        console.log(xhttp.responseText);
        window.location.href = xhttp.responseText;
        console.log("Switching to login.html!");
    }
}