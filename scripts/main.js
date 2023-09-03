let url = new URL('https://reqres.in/api/users/');
let userID;
$(function () {
    $(".search-user").on("submit", getSingleUser);
    $(document).on("click", "#create-user", createUser);
    $(document).on("click", "#deletebtn", deleteUser);
    $(document).on("click", "#createnewbtn", renderCreateForm);
    $(document).on("click", "#updatebtn", updateUser);
});


async function getSingleUser(event) {
    event.preventDefault();
    $("#container").html("<div class='loader'></div>");
    userID = $("#user-id").val();
    let userURL = new URL(userID, url);
    let response;
    let user;
    try {
        response = await fetch(userURL);
        if (response.ok) {
            user = await response.json();
            renderUser(user.data);
        } else {
            throw new Error("Something went wrong");
        }

    } catch (error) {
        console.log(error);
        renderError(error, response.status);
    }
}

async function createUser(event) {
    event.preventDefault();
    let user = {
        name: $("#newUserName").val(),
        job: $("#newUserJob").val()
    };

    let body = JSON.stringify(user);
    let response;
    let createdUser;
    try {
        response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: body
        });
        if (response.ok) {
            createdUser = await response.json();
            console.log(createdUser);
            userID = createdUser.id;
            renderUser(createdUser);
        }
    } catch (error) {
        console.log(error);
        renderError(error, response.status);
    }

}

async function updateUser(event) {
    event.preventDefault();
    let user = {
        name: $("#edit-user-name").val(),
        job: $("#edit-user-job").val(),
    };
    let body = JSON.stringify(user);
    let response;
    let updatedUser;
    try {
        response = await fetch(url, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: body
        });
        if (response.ok) {
            updatedUser = await response.json();
            console.log(updatedUser);
            renderUser(updatedUser);
        }
    } catch (error) {
        console.log(error);
        renderError(error, response.status);
    }

}

async function deleteUser(event) {
    event.preventDefault();
    if (userID == 0) {
        return;
    }
    let userURL = new URL(userID, url);
    let response;
    try {
        response = await fetch(userURL, {
            method: "DELETE"
        });
        if (response.ok) {
            console.log(response.status);
            $(".user-container").html(`<p class='delete-message'>User with ID ${userID} deleted!</p>`);
            userID = 0;
        }
    } catch (error) {
        console.log(error);
        renderError(error, response.status);
    }

}

function renderUser(user) {
    $(function () {

        let userContainer = $("<div></div>").addClass("user-container")
            .attr("id", user.id.toString());
        let avatar;
        if (user.hasOwnProperty("avatar")) {
            avatar = $("<img>").attr({
                "src": user.avatar,
                "alt": "User avatar",
            });
        } else {
            avatar = $("<img>").attr({
                "src": "defaultImg.jpg",
                "alt": "User avatar",
            });
        }
        $("#container").empty();
        userContainer.append(avatar);

        let userInfo = $("<div></div>").addClass("user-info");

        let form = $("<form></form>").addClass("edit-user");
        let labelName = $("<label></label>").attr("for", "edit-user-name").text("User name: ");
        let name;
        if (user.hasOwnProperty("name")) {
            name = user.name;
        } else {
            name = `${user.first_name} ${user.last_name}`;
        }
        let inputName = $("<input></input>").attr({
            "type": "text",
            "id": "edit-user-name",
            "name": "edit-user-name",
            "value": name,
        });
        form.append($("<div></div>").addClass("form-section").append(labelName, inputName));

        let labelJob = $("<label></label>").attr("for", "edit-user-job").text("User job: ");
        let inputJob = $("<input></input>").attr({
            "type": "text",
            "id": "edit-user-job",
            "name": "edit-user-job",
            "value": user.hasOwnProperty("job") ? user.job : '',
        });
        form.append($("<div></div>").addClass("form-section").append(labelJob, inputJob));
        userInfo.append(form);
        if (user.hasOwnProperty("email")) {
            let email = $("<p></p>").addClass("email").html(`<span>User email:</span><span>${user.email}</span>`);
            userInfo.append(email);
        }
        userContainer.append(userInfo);
        $("#container").append(userContainer);
        renderButtons();
    });
}


function renderButtons() {
    let createBtn = $("<button></button>").text("Create new user").attr("id", "createnewbtn");
    let updateBtn = $("<button></button>").text("Update").attr("id", "updatebtn");
    let deleteBtn = $("<button></button>").text("Delete").attr("id", "deletebtn");
    let wrapBtns = $("<div></div>").append(createBtn, updateBtn, deleteBtn).addClass("buttons");
    $("#container").append(wrapBtns);
}

function renderCreateForm() {
    $("#container").empty();
    let form = $("<form></form>").addClass("create-user");
    form.append($("<h4></h4>").text("Create new user"));
    let labelName = $("<label></label>").attr("for", "newUserName").text("Name:");
    let inputName = $("<input>").attr({
        "type": "text",
        "id": "newUserName",
        "name": "newUserName",
        "placeholder": "Name",
        "required": "true"
    });
    let sectionName = $("<div></div>").addClass("form-section");
    sectionName.append(labelName, inputName);

    let labelJob = $("<label></label>").attr("for", "newUserJob").text("Job:");
    let inputJob = $("<input>").attr({
        "type": "text",
        "id": "newUserJob",
        "name": "newUserJob",
        "placeholder": "Job",
        "required": "true"
    });
    let sectionJob = $("<div></div>").addClass("form-section");
    sectionJob.append(labelJob, inputJob);
    let submit = $("<input type='submit' id='create-user' value='Create user'>");
    form.append(sectionName, sectionJob, submit);
    $("#container").append(form);
}

function renderError(error, status) {
    let notFound;
    status == 404 ? notFound = "User not found" : notFound = '';
    let errorMessage = $("<div></div>").addClass("error-message").html(`${error}
                        <br><span>${status}</span><p>${notFound}</p>`);
    $("#container").empty();
    $("#container").append(errorMessage);

}

