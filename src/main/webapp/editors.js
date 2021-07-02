let url = "http://localhost:8080/Project1/FrontController"
let logged_in;
let time_limit = 1.21e+9;

function getStories(){
    console.log("displaying your committee's stories");
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", url + "/get_proposals", true);
    xhttp.send();

    let dataSection = document.getElementById("committeeData");
    dataSection.innerHTML = '';

    xhttp.onreadystatechange = () => {
        console.log(xhttp.readyState);
        console.log(xhttp.status);
        if(xhttp.readyState == 4){
            if(xhttp.status == 200){

                let dataSection = document.getElementById('committeeData');
                dataSection.innerHTML = '';

                let strs = xhttp.responseText.split("|");
                logged_in = strs[0];
                console.log(strs[0]);
                //let committee = JSON.parse(strs[1]);
                let stories = JSON.parse(strs[1]);
                console.log(strs[1])

                let lock = false;
                let senior = logged_in == "senior";
                let general = logged_in == "general";
                let assistant = logged_in == "assistant";
                let author = logged_in == "author";

                //create table
                let authorTable = document.createElement('table');
                authorTable.id = 'authorTable';
                for (let story of stories){
                    
                    let overdue = checkOverdue(story);
                    if (overdue) lock = true;
                    //create table header row
                    let thRow = document.createElement('tr');
                    let tHeaders = ['Overdue', 'Title', 'Genre', 'Story Type', 'Description',
                                    'Tag Line', 'Completion Date', 'Approval Status', 
                                    'Editor Functions'];
                    for (let h of tHeaders){
                        let th = document.createElement('th');
                        th.innerHTML = h;
                        thRow.appendChild(th);
                    }

                    authorTable.append(thRow);

                    //Iterate through the stories and create a table row with the date we want
                    //for (story of stories){
                    let tr = document.createElement('tr');

                    //Overdue
                    let tdOverDue = document.createElement('td');
                    if(overdue && !author){
                        tdOverDue.innerHTML = 'OVERDUE!';
                    } else {
                        tdOverDue.innerHTML = 'NOT OVERDUE';
                    }
                    tr.appendChild(tdOverDue);

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
                    
                    //Info Request
                    let tdInfoButton = document.createElement('button');
                    tdInfoButton.innerHTML = 'Request Info';
                    tr.appendChild(tdInfoButton);
                    
                    //Approve
                    let tdApproveButton = document.createElement('button');
                    tdApproveButton.innerHTML = "Approve";
                    tr.appendChild(tdApproveButton);
                    
                    //Reject
                    let tdRejectButton = document.createElement('button');
                    tdRejectButton.innerHTML = 'Reject'
                    tr.appendChild(tdRejectButton);

                    //Info Button Handling
                    console.log(author, senior, overdue);
                    if((author || senior) || ((overdue == lock) && (assistant || general))){
                        tdInfoButton.onclick = function sendInfoRequest(){
                            console.log("button pressed" + story);
                            let json = JSON.stringify(story);
                            console.log("json: " + json);

                            let xhttp = new XMLHttpRequest();
                            xhttp.open("POST", url + "/save_story_to_session", true);
                            xhttp.send(json);

                            console.log("sent json");
                            xhttp.onreadystatechange = sendInfoData;

                            function sendInfoData(){
                                console.log(xhttp.readyState);
                                console.log(xhttp.status);
                                if(xhttp.readyState == 4){
                                    if(xhttp.status == 200){
                                        if(xhttp.responseText == 'saved'){
                                            console.log("saved story!");
                                            window.location.href = "inforequest.html";
                                        }
                                    }
                                }
                            }
                        }
                    }
                    //Approval Button Handling does
                    if ((author || senior) || ((overdue == lock) && (assistant || general))){
                        tdApproveButton.onclick = function sendApproval(){

                            console.log("button pressed" + story);
                            let json = JSON.stringify(story);
                            console.log("json: " + json);

                            let xhttp = new XMLHttpRequest();
                            xhttp.open("POST", url + "/approve_story", true);
                            xhttp.send(json);
                    
                            console.log("sent json");
                            xhttp.onreadystatechange = sendData;

                            function sendData(){
                                console.log(xhttp.readyState);
                                console.log(xhttp.status);
                                    if(xhttp.readyState == 4){
                                        if(xhttp.status == 200){
                                        let xhttp = new XMLHttpRequest();
                                        xhttp.open("POST", url + "/save_story_to_session", true);
                                        xhttp.send(JSON.stringify(story));
                                    
                                        xhttp.onreadystatechange = () => {
                                        if (xhttp.readyState == 4) {
                                            if (xhttp.status == 200) {
                                                if (xhttp.responseText == "saved") {
                                                    console.log("saved story!");
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    //Reject Button Handling
                    
                    if((author || senior) || ((overdue == lock) && (assistant || general))){
                        tdRejectButton.onclick = function sendInfoRequest(){
                            console.log("button pressed" + story);
                            let json = JSON.stringify(story);
                            console.log("json: " + json);

                            let xhttp = new XMLHttpRequest();
                            xhttp.open("POST", url + "/save_story_to_session", true);
                            xhttp.send(json);

                            console.log("sent json");
                            xhttp.onreadystatechange = sendInfoData;

                            function sendInfoData(){
                                console.log(xhttp.readyState);
                                console.log(xhttp.status);
                                if(xhttp.readyState == 4){
                                    if(xhttp.status == 200){
                                        if(xhttp.responseText == 'saved'){
                                            console.log("saved story!");
                                            window.location.href = "rejectscript.html";
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                authorTable.appendChild(tr);
                authorTable.setAttribute("border", 2);
                }
                dataSection.appendChild(authorTable);
            }
        }
    }
}

function getDrafts(){
    console.log("displaying your committee's stories");
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", url + "/get_draft_requests", true);
    xhttp.send();

    let dataSection = document.getElementById("draftsData");
    dataSection.innerHTML = '';

    xhttp.onreadystatechange = () => {
        console.log(xhttp.readyState);
        console.log(xhttp.status);
        if(xhttp.readyState == 4){
            if(xhttp.status == 200){

                let dataSection = document.getElementById('draftsData');
                dataSection.innerHTML = '';

                let strs = xhttp.responseText.split("|");
                logged_in = strs[0];
                console.log(strs[0]);
                
                let stories = JSON.parse(strs[1]);
                console.log(strs[1])

                let lock = false;
                let senior = logged_in == "senior";
                let general = logged_in == "general";
                let assistant = logged_in == "assistant";
                let author = logged_in == "author";

                //create table
                let authorTable = document.createElement('table');
                authorTable.id = 'authorTable';
                for (let story of stories){
                    
                    let overdue = checkOverdue(story);
                    if (overdue) lock = true;
                    //create table header row
                    let thRow = document.createElement('tr');
                    let tHeaders = ['Overdue', 'Title', 'Genre', 'Story Type', 'Description',
                                    'Tag Line', 'Completion Date', 'Approval Status', 
                                    'Editor Functions'];
                    for (let h of tHeaders){
                        let th = document.createElement('th');
                        th.innerHTML = h;
                        thRow.appendChild(th);
                    }

                    authorTable.append(thRow);

                    //Iterate through the stories and create a table row with the date we want
                    //for (story of stories){
                    let tr = document.createElement('tr');

                    //Overdue
                    let tdOverDue = document.createElement('td');
                    if(overdue && !author){
                        tdOverDue.innerHTML = 'OVERDUE!';
                    } else {
                        tdOverDue.innerHTML = 'NOT OVERDUE';
                    }
                    tr.appendChild(tdOverDue);

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
                    
                    //Info Request
                    let tdInfoButton = document.createElement('button');
                    tdInfoButton.innerHTML = 'Request Info';
                    tr.appendChild(tdInfoButton);
                    
                    //Approve
                    let tdApproveButton = document.createElement('button');
                    tdApproveButton.innerHTML = "Approve";
                    tr.appendChild(tdApproveButton);
                    
                    //Reject
                    let tdRejectButton = document.createElement('button');
                    tdRejectButton.innerHTML = 'Reject'
                    tr.appendChild(tdRejectButton);

                    //Info Button Handling
                    console.log(author, senior, assistant, general, overdue);
                    if((author || senior) || ((overdue == lock) && (assistant || general))){
                        tdInfoButton.onclick = function sendInfoRequest(){
                            console.log("button pressed" + story);
                            let json = JSON.stringify(story);
                            console.log("json: " + json);

                            let xhttp = new XMLHttpRequest();
                            xhttp.open("POST", url + "/save_story_to_session", true);
                            xhttp.send(json);

                            console.log("sent json");
                            xhttp.onreadystatechange = sendInfoData;

                            function sendInfoData(){
                                console.log(xhttp.readyState);
                                console.log(xhttp.status);
                                if(xhttp.readyState == 4){
                                    if(xhttp.status == 200){
                                        if(xhttp.responseText == 'saved'){
                                            console.log("saved story!");
                                            window.location.href = "inforequest.html";
                                        }
                                    }
                                }
                            }
                        }
                    }
                    //Approval Button Handling does
                    if ((author || senior) || ((overdue == lock) && (assistant || general))){
                        tdApproveButton.onclick = function sendApproval(){

                            console.log("button pressed" + story);
                            let json = JSON.stringify(story);
                            console.log("json: " + json);

                            let xhttp = new XMLHttpRequest();
                            xhttp.open("POST", url + "/approve_draft", true);
                            xhttp.send(json);
                    
                            console.log("sent json");
                            xhttp.onreadystatechange = sendData;

                            function sendData(){
                                console.log(xhttp.readyState);
                                console.log(xhttp.status);
                                    if(xhttp.readyState == 4){
                                        if(xhttp.status == 200){
                                        let xhttp = new XMLHttpRequest();
                                        xhttp.open("POST", url + "/save_story_to_session", true);
                                        xhttp.send(JSON.stringify(story));
                                    
                                        xhttp.onreadystatechange = () => {
                                        if (xhttp.readyState == 4) {
                                            if (xhttp.status == 200) {
                                                if (xhttp.responseText == "saved") {
                                                    console.log("saved story!");
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    //Reject Button Handling
                    
                    if((author || senior) || ((overdue == lock) && (assistant || general))){
                        tdRejectButton.onclick = function sendInfoRequest(){
                            console.log("button pressed" + story);
                            let json = JSON.stringify(story);
                            console.log("json: " + json);

                            let xhttp = new XMLHttpRequest();
                            xhttp.open("POST", url + "/save_story_to_session", true);
                            xhttp.send(json);

                            console.log("sent json");
                            xhttp.onreadystatechange = sendInfoData;

                            function sendInfoData(){
                                console.log(xhttp.readyState);
                                console.log(xhttp.status);
                                if(xhttp.readyState == 4){
                                    if(xhttp.status == 200){
                                        if(xhttp.responseText == 'saved'){
                                            console.log("saved story!");
                                            window.location.href = "rejectscript.html";
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                authorTable.appendChild(tr);
                authorTable.setAttribute("border", 2);
                }
                dataSection.appendChild(authorTable);
            }
        }
    }
}

function checkOverdue(story) {
    console.log(story.title + " has approval status " + story.approvalStatus);
    return getDateDifference(story.submissionDate) > time_limit;
}

function getDateDifference(submitted){
    const current = new Date;
    submitted = new Date(submitted);
    return current - submitted;
}

function infoRequest(){
    window.location.href = "/Project1/inforequest.html";
}

function getAuthorMessages(){
    console.log("displaying author's messages");
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", url + "/get_author_messages", true);
    xhttp.send();
    console.log(xhttp.responseText);

    let dataSection = document.getElementById('authorMessageData');
    dataSection.innerHTML = '';

    xhttp.onreadystatechange = () => {
        console.log(xhttp.readyState);
        console.log(xhttp.status);
        if(xhttp.readyState == 4){
            if(xhttp.status == 200){

                let dataSection = document.getElementById('authorMessageData');
                dataSection.innerHTML = '';

                let msgs = xhttp.responseText.split("|");
                logged_in = JSON.parse(msgs[1]);
                let messages = JSON.parse(msgs[0]);

                //create table
                let messageTable = document.createElement('table');
                messageTable.id = 'messageTable';

                console.log(msgs[0]);
                console.log(msgs[1]);
                for (let message of messages){
                    //create table header row
                    let thRow = document.createElement('tr');
                    let tHeaders = ['Title', 'From Author', 'Author Message'];
                    for (let h of tHeaders){
                        let th = document.createElement('th');
                        th.innerHTML = h;
                        thRow.appendChild(th);
                    }

                    messageTable.append(thRow);
                    
                    //Iterate through the stories and create a table row with the date we want
                   // for (message of msgs){
                    let tr = document.createElement('tr');

                    //Title of Work
                    let tdTitle = document.createElement('td');
                    tdTitle.innerHTML = message.title.title;
                    tr.appendChild(tdTitle);

                    //Editor's Name
                    let tdAuthor = document.createElement('td');
                    tdAuthor.innerHTML = message.title.author.firstName;
                    tr.appendChild(tdAuthor);

                    //Editor's Message
                    let tdAuthorMessage = document.createElement('td');
                    tdAuthorMessage.innerHTML = message.authorMessage;
                    console.log(message.authorMessage);
                    tr.appendChild(tdAuthorMessage);

                    messageTable.appendChild(tr);
                   // }
                    
                    dataSection.appendChild(messageTable);
                }
            }
        }
    }
}

function getEditorMessages(){
    console.log("displaying other editor's messages");
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", url + "/get_other_editor_messages", true);
    xhttp.send();
    console.log(xhttp.responseText);

    let dataSection = document.getElementById('editorMessageData');
    dataSection.innerHTML = '';

    xhttp.onreadystatechange = () => {
        console.log(xhttp.readyState);
        console.log(xhttp.status);
        if(xhttp.readyState == 4){
            if(xhttp.status == 200){
                
                console.log(xhttp.responseText);

                let dataSection = document.getElementById('editorMessageData');
                dataSection.innerHTML = '';

                let msgs = xhttp.responseText.split("|");
                logged_in = JSON.parse(msgs[0])
                let messages = JSON.parse(msgs[1]);
                console.log(xhttp.responseText);
                
                //create table
                let messageTable = document.createElement('table');
                messageTable.id = 'messageTable';

                let thRow = document.createElement('tr');
                    let tHeaders = ['Title', 'From Editor', 'Editor Message'];
                    for (let h of tHeaders){
                        let th = document.createElement('th');
                        th.innerHTML = h;
                        thRow.appendChild(th);
                    }

                    messageTable.append(thRow);
                
                for (let message of messages){
                    //create table header row
                    

                    //Iterate through the stories and create a table row with the date we want
                    //for (story of r){
                    let tr = document.createElement('tr');
                    console.log(messages);

                    //Title of Work
                    let tdTitle = document.createElement('td');
                    tdTitle.innerHTML = message.title.title;
                    tr.appendChild(tdTitle);

                    //Author's Name
                    let tdEditor = document.createElement('td');
                    tdEditor.innerHTML = message.fromEditor.firstName;
                    tr.appendChild(tdEditor);

                    //Author's Message
                    let tdEditorMessage = document.createElement('td');
                    tdEditorMessage.innerHTML = message.editorMessage;
                    tr.appendChild(tdEditorMessage);

                    messageTable.appendChild(tr);
                    
                    dataSection.appendChild(messageTable);
                }
            }
        }
    }
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