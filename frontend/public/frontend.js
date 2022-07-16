const departmentButton = document.getElementById("department_button");
departmentButton.addEventListener("click", handlePUT);

const searchButton = document.getElementById('search_button');
searchButton.addEventListener("click", handlePOST);

function handleClickMe() {
	alert("Button Clicked!");
}

let departments = [];

async function handlePUT() {
	event.preventDefault();

	const selection = document.getElementById("dept").value;
	console.log(selection);

	if (departments.includes(selection)) {
		const removeRequest = await fetch("http://localhost:4321/dataset/" + selection, {
			method: 'DELETE'
		})

		let rmvIndex = departments.indexOf(selection);	// removes the selected dept if it's already in internal
		if (rmvIndex !== -1) {							// departments array
			departments.splice(rmvIndex, 1);
		}
	}

	departments.push(selection);

	const request = await fetch("http://localhost:4321/dataset/" + selection + "/courses", {
		method: 'PUT'
	}); // If you already have a data folder with the departments before adding any departments after a refresh,
	// it's gonna throw an error since the internal is gonna be empty while the data folder is not

	const responseStatus = request.status;
	const response = await request.json();

	if (responseStatus === 200) {
		// success case
		console.log(response.result);
		alert("You have chosen the department " + selection);
		document.getElementById("us1").innerHTML = "Chosen Department " + selection;
		document.getElementById("us1.2").innerHTML = "";
	}

	if (responseStatus === 400) {
		// error case
		console.error(response.err);
		alert("You have chosen an invalid dataset. Please try again");
		document.getElementById("us1.2").innerHTML = "Invalid Choice, Try Again";
		document.getElementById("us1").innerHTML = "";
	}
}

async function handlePOST() {
	event.preventDefault();

	const input = document.getElementById("avg").value;
	// console.log(input);
	// console.log(typeof input);
	// alert(typeof input);

	const num = Number(input);

	// alert(typeof num);


	const selection = document.getElementById("dept").value;
	// console.log(selection);

	const dept = selection + "_dept";
	const id = selection + "_id";
	const avg = selection + "_avg";

	// console.log(dept);
	// console.log(id);
	// console.log(avg);

	const queryData = {
		"WHERE": {
			"GT": {
				"courses_avg": num
			}
		},
		"OPTIONS": {
			"COLUMNS": [
				id,
				avg
			],
			"ORDER": avg
		}
	};
	// console.log(JSON.stringify(queryData));

	const request = await fetch("http://localhost:4321/query", {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(queryData)
	});

	const responseStatus = request.status;
	const response = await request.json();

	if (responseStatus === 200) {
		// success case

		const str = JSON.stringify(response.result, null, 4);

		if (response.result.length === 0) {
			alert("No booster courses could be found");
			document.getElementById("us2").innerHTML = "";
			document.getElementById("us2.2").innerHTML = "Couldn't Get Query Results" +
				", Try Another Number or Department";
		} else {
			alert("We found the following courses that fit your criterion:");
			document.getElementById("us2").innerHTML = str;
			document.getElementById("us2.2").innerHTML = "";
		}
	}

	if (responseStatus === 400) {
		// error case
		console.error(response.err);
		alert("Your query could not be performed.");
		document.getElementById("us2.2").innerHTML = "Couldn't Get Query Results" +
		", Try Another Number or Department";
		document.getElementById("us2").innerHTML = "";
	}
}
