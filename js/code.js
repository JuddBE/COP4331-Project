const urlBase = 'http://COP4331-18.online/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

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
                    text += "<tr id='row" + i + "'>"
                    text += "<td id='firstName" + i + "'><span>" + jsonObject.results[i].FirstName + "</span></td>";
                    text += "<td id='lastName" + i + "'><span>" + jsonObject.results[i].LastName + "</span></td>";
                    text += "<td id='email" + i + "'><span>" + jsonObject.results[i].Email + "</span></td>";
                    text += "<td id='phone" + i + "'><span>" + jsonObject.results[i].Phone + "</span></td>";
                    text += "<td>" +
                        "<button class='btn btn-warning btn-sm' id='edit_button" + i + "'><span>Edit</span></button>" +
                        "<button class='btn btn-warning btn-sm' id='save_button" + i + "' value='Save' style='display: none'><span>Save</span></button>" +
                        "<button class='btn btn-warning btn-sm'  onclick='deleteContact(" + i + ")'>" + "<span>Delete</span>" + "</button>" + "</td>";
						
                    text += "<tr/>"
                }
                text += "</table>"
				document.getElementById("tbody").innerHTML = text;
				// for( let i=0; i<jsonObject.results.length; i++ )
				// {
				// 	contactList += jsonObject.results[i].FirstName;
				// 	if( i < jsonObject.results.length - 1 )
				// 	{
				// 		contactList += "<br />\r\n";
				// 	}
				// }
				
				// document.getElementsByTagName("p")[0].innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}	
}

function addContact()
{
	let firstName = document.getElementById("newContactFirstNameText").value;
	let lastName = document.getElementById("newContactLastNameText").value;
	let email = document.getElementById("newContactEmailText").value;
	let phone = document.getElementById("newContactPhoneText").value;

	// Getting current date for dateCreated of contact
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

function deleteContact(rowNumber) {
    let firstNameVal = document.getElementById("firstName" + rowNumber).innerText;
    let lastNameVal = document.getElementById("lastName" + rowNumber).innerText;
    
	let name1 = firstNameVal.substring(0, firstNameVal.length);
    let name2 = lastNameVal.substring(0, lastNameVal.length);
	
	let check = confirm('Are you sure you would like to delete contact: ' + name1 + ' ' + name2 + '?');
    if (check === true) {
        document.getElementById("row" + rowNumber + "").outerHTML = "";
        
		let tmp = {userId: userId, contactId: rowNumber};

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

