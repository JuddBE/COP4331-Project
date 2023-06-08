const urlBase = 'http://COP4331-18.online/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
const contactIds = [];

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
    // var hash = md5( password );

	document.getElementById("loginResult").innerHTML = "";

	var tmp = {login:login,password:password};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "color.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doSignup() 
{
    firstName = document.getElementById("firstName").value;
    lastName = document.getElementById("lastName").value;

    let username = document.getElementById("userName").value;
    let password = document.getElementById("password").value;

    // var hash = md5(password);

	if (!signUpFormatCheck(firstName, lastName, username, password)) {
        document.getElementById("signupResult").innerHTML = "invalid signup";
        return;
    }
	
    document.getElementById("signupResult").innerHTML = "";

    let tmp = {firstName:firstName,lastName:lastName,login:username,password:password};

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SignUp.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {

            if (this.readyState != 4) {
                return;
            }

            if (this.status == 409) {
                document.getElementById("signupResult").innerHTML = "User already exists";
                return;
            }

            if (this.status == 200) {

                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;
                document.getElementById("signupResult").innerHTML = "User added successfully";
                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;
                saveCookie();
            }
        };

        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("signupResult").innerHTML = err.message;
    }
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function searchContacts()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	
	// Create empty list to append search results to
	let contactList = "";

	let tmp = {userId:userId,search:srch};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				let text = "<table border='1'>"
                for (let i = 0; i < jsonObject.results.length; i++) {
					// Sve each contact id from search result into array for accessing in edit, save, and delete
					contactIds[i] = jsonObject.results[i].ContactId;

					// Dsiplay search results in contact table on page and create edit and delete buttons
                    text += "<tr id='row" + i + "'>"
                    text += "<td id='firstName" + i + "'><span>" + jsonObject.results[i].FirstName + "</span></td>";
                    text += "<td id='lastName" + i + "'><span>" + jsonObject.results[i].LastName + "</span></td>";
                    text += "<td id='email" + i + "'><span>" + jsonObject.results[i].Email + "</span></td>";
                    text += "<td id='phone" + i + "'><span>" + jsonObject.results[i].Phone + "</span></td>";
                    text += "<td>" +
                        "<button class='btn btn-warning btn-sm' id='editButton" + i + "' onclick='editContact(" + i + ")'><span>Edit</span></button>" +
                        "<button class='btn btn-warning btn-sm' id='saveButton" + i + "' value='Save' onclick='saveContact(" + i + ")' style='display: none'><span>Save</span></button>" +
                        "<button class='btn btn-warning btn-sm'  onclick='deleteContact(" + i + ")'>" + "<span>Delete</span>" + "</button>" + "</td>";
                    text += "<tr/>"
                }
                text += "</table>"
				document.getElementById("tbody").innerHTML = text;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}	
}

function editContact(rowNumber) {
    document.getElementById("editButton" + rowNumber).style.display = "none";
    document.getElementById("saveButton" + rowNumber).style.display = "inline-block";

    var firstNameI = document.getElementById("firstName" + rowNumber);
    var lastNameI = document.getElementById("lastName" + rowNumber);
    var email = document.getElementById("email" + rowNumber);
    var phone = document.getElementById("phone" + rowNumber);

    var namef_data = firstNameI.innerText;
    var namel_data = lastNameI.innerText;
    var email_data = email.innerText;
    var phone_data = phone.innerText;

    firstNameI.innerHTML = "<input type='text' id='namef_text" + rowNumber + "' value='" + namef_data + "'>";
    lastNameI.innerHTML = "<input type='text' id='namel_text" + rowNumber + "' value='" + namel_data + "'>";
    email.innerHTML = "<input type='text' id='email_text" + rowNumber + "' value='" + email_data + "'>";
    phone.innerHTML = "<input type='text' id='phone_text" + rowNumber + "' value='" + phone_data + "'>"
}

function saveContact(rowNumber) {
    var namef_val = document.getElementById("namef_text" + rowNumber).value;
    var namel_val = document.getElementById("namel_text" + rowNumber).value;
    var email_val = document.getElementById("email_text" + rowNumber).value;
    var phone_val = document.getElementById("phone_text" + rowNumber).value;

    document.getElementById("firstName" + rowNumber).innerHTML = namef_val;
    document.getElementById("lastName" + rowNumber).innerHTML = namel_val;
    document.getElementById("email" + rowNumber).innerHTML = email_val;
    document.getElementById("phone" + rowNumber).innerHTML = phone_val;

    document.getElementById("editButton" + rowNumber).style.display = "inline-block";
    document.getElementById("saveButton" + rowNumber).style.display = "none";

	let id_val = contactIds[rowNumber];

	let tmp = {firstName:namef_val, lastName:namel_val, Email:email_val, phone:phone_val, ID:id_val};

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/UpdateContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Contact has been updated");
                searchContacts()
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}

function addContact()
{
	let firstName = document.getElementById("newContactFirstNameText").value;
	let lastName = document.getElementById("newContactLastNameText").value;
	let email = document.getElementById("newContactEmailText").value;
	let phone = document.getElementById("newContactPhoneText").value;

	if (!contactFormatCheck(firstName, lastName, phone, email)) {
		document.getElementById("contactAddResult").innerHTML = "Invalid formatting for one or more fields.";
        return;
    }
	const date = new Date();
	let day = date.getDate();
	let month = date.getMonth() + 1; // date.getMonth returns month zero-indexed
	let year = date.getFullYear();
	let dateCreated = `${month}-${day}-${year}`;

	document.getElementById("contactAddResult").innerHTML = "";

	let tmp = {userId:userId, firstName:firstName, lastName:lastName, email:email, phone:phone, dateCreated:dateCreated};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactAddResult").innerHTML = "Contact has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
}

function deleteContact(rowNumber) 
{
	let contactId = contactIds[rowNumber];
    let firstNameVal = document.getElementById("firstName" + rowNumber).innerText;
    let lastNameVal = document.getElementById("lastName" + rowNumber).innerText;
    
	let name1 = firstNameVal.substring(0, firstNameVal.length);
    let name2 = lastNameVal.substring(0, lastNameVal.length);
	
	let check = confirm('Are you sure you would like to delete contact: ' + name1 + ' ' + name2 + '?');
    if (check === true) {
        document.getElementById("row" + rowNumber + "").outerHTML = "";
        
		let tmp = {userId: userId, contactId: contactId};

        let jsonPayload = JSON.stringify(tmp);

        let url = urlBase + '/DeleteContact.' + extension;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try {
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {

                    console.log("Contact has been deleted");
                }
            };
            xhr.send(jsonPayload);
        } catch (err) {
            console.log(err.message);
		}
    };
}

function signUpFormatCheck(firstname, lastname, username, password) {

	let fnameFlag = true;
	let lnameFlag = true;
	let usernameFlag = true;
	let passFlag = true;
   
    if (firstname == "") {
        console.log("FIRST NAME IS BLANK");
    }
    else {
        console.log("first name IS VALID");
        fnameFlag = false;
    }

    if (lastname == "") {
        console.log("LAST NAME IS BLANK");
    }
    else {
        console.log("LAST name IS VALID");
        lnameFlag = false;
    }

    if (username == "") {
        console.log("USERNAME IS BLANK");
    }
    else {
        var regex = /(?=.*[a-zA-Z])[a-zA-Z0-9-_](?=.*[!@#$%^&*]).{3,18}$/;
		// atleast:
		// 3 characters, 1 special character, and 1 number.

        if (regex.test(username) == false) {
            console.log("USERNAME IS NOT VALID");
        }

        else {

            console.log("USERNAME IS VALID");
            usernameFlag = false;
        }
    }

    if (password == "") {
        console.log("PASSWORD IS BLANK");
    }
    else {
        var regex = /(?=.*\d)(?=.*[A-Z])(?=.*[A-Za-z])(?=.*[!@#$%^&*]).{8,32}/;
		// Atleast: 
		// 8 characters, 1 capital letter, 1 number, 1 special character. 

        if (regex.test(password) == false) {
            console.log("PASSWORD IS NOT VALID");
        }

        else {

            console.log("PASSWORD IS VALID");
            passFlag = false;
        }
    }

    if ((fnameFlag || lnameFlag || usernameFlag || passFlag) == true) {
        return false;

    }

    return true;
}

function contactFormatCheck(firstName, lastName, phone, email) {
	let fnameFlag = true;
	let lnameFlag = true;
	let phoneFlag = true;
	let emailFlag = true;

    if (firstName == "") {
        console.log("FIRST NAME IS BLANK");
    }
    else {
        console.log("first name IS VALID");
        fnameFlag = false;
    }

    if (lastName == "") {
        console.log("LAST NAME IS BLANK");
    }
    else {
        console.log("LAST name IS VALID");
        lnameFlag = false;
    }

    if (phone == "") {
        console.log("PHONE IS BLANK");
    }
    else {
        var regex = /^[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;

        if (regex.test(phone) == false) {
            console.log("PHONE IS NOT VALID");
        }

        else {

            console.log("PHONE IS VALID");
            phoneFlag = false;
        }
    }

    if (email == "") {
        console.log("EMAIL IS BLANK");
    }
    else {
        var regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

        if (regex.test(email) == false) {
            console.log("EMAIL IS NOT VALID");
        }

        else {

            console.log("EMAIL IS VALID");
            emailFlag = false;
        }
    }

    if ((fnameFlag || lnameFlag || phoneFlag || emailFlag) == true) {
        return false;

    }

    return true;
}

addEventListener("DOMContentLoaded", (event) => {
    const password = document.getElementById("password");
    const passwordAlert = document.getElementById("password-alert");
    const requirements = document.querySelectorAll(".requirements");
    let lengBoolean, bigLetterBoolean, numBoolean, specialCharBoolean;
    let leng = document.querySelector(".leng");
    let bigLetter = document.querySelector(".big-letter");
    let num = document.querySelector(".num");
    let specialChar = document.querySelector(".special-char");
    const specialChars = "!@#$%^&*()-_=+[{]}\\|;:'\",<.>/?`~";
    const numbers = "0123456789";

    requirements.forEach((element) => element.classList.add("wrong"));

    password.addEventListener("focus", () => {
        passwordAlert.classList.remove("d-none");
        if (!password.classList.contains("is-valid")) {
            password.classList.add("is-invalid");
        }
    });

    password.addEventListener("input", () => {
        let value = password.value;
        if (value.length < 8) {
            lengBoolean = false;
        } else if (value.length > 7) {
            lengBoolean = true;
        }

        if (value.toLowerCase() == value) {
            bigLetterBoolean = false;
        } else {
            bigLetterBoolean = true;
        }

        numBoolean = false;
        for (let i = 0; i < value.length; i++) {
            for (let j = 0; j < numbers.length; j++) {
                if (value[i] == numbers[j]) {
                    numBoolean = true;
                }
            }
        }

        specialCharBoolean = false;
        for (let i = 0; i < value.length; i++) {
            for (let j = 0; j < specialChars.length; j++) {
                if (value[i] == specialChars[j]) {
                    specialCharBoolean = true;
                }
            }
        }

        if (lengBoolean == true && bigLetterBoolean == true && numBoolean == true && specialCharBoolean == true) {
            password.classList.remove("is-invalid");
            password.classList.add("is-valid");

            requirements.forEach((element) => {
                element.classList.remove("wrong");
                element.classList.add("good");
            });
            passwordAlert.classList.remove("alert-warning");
            passwordAlert.classList.add("alert-success");
        } else {
            password.classList.remove("is-valid");
            password.classList.add("is-invalid");

            passwordAlert.classList.add("alert-warning");
            passwordAlert.classList.remove("alert-success");

            if (lengBoolean == false) {
                leng.classList.add("wrong");
                leng.classList.remove("good");
            } else {
                leng.classList.add("good");
                leng.classList.remove("wrong");
            }

            if (bigLetterBoolean == false) {
                bigLetter.classList.add("wrong");
                bigLetter.classList.remove("good");
            } else {
                bigLetter.classList.add("good");
                bigLetter.classList.remove("wrong");
            }

            if (numBoolean == false) {
                num.classList.add("wrong");
                num.classList.remove("good");
            } else {
                num.classList.add("good");
                num.classList.remove("wrong");
            }

            if (specialCharBoolean == false) {
                specialChar.classList.add("wrong");
                specialChar.classList.remove("good");
            } else {
                specialChar.classList.add("good");
                specialChar.classList.remove("wrong");
            }
        }
    });

    password.addEventListener("blur", () => {
        passwordAlert.classList.add("d-none");
    });
});

