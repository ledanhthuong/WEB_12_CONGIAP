function fetchUsers() {
    $.get("https://localhost:44345/admin/getSv", function (data, status) {
        var jsonData = data;

        // Create the table element
        let table = $("#userTable");
        table.empty();

        // Get the keys names
        let cols = Object.keys(jsonData[0]);
        cols.push("Action");

        // Create the header
        let thead = $("<thead>");
        let tbody = $('<tbody id="tbody">');
        let tr = $("<tr>");

        // Loop through the column names and create the header cells
        $.each(cols, function (i, item) {
            if (item !== "salt" && item !== "hashed_pw" && item !== "picture") {
                item = item[0].toUpperCase() + item.slice(1);

                let th = $('<th scope="col">');
                th.text(item);
                tr.append(th);
            }
        });
        thead.append(tr);
        table.append(thead);

        // Populate table rows with user data
        $.each(jsonData, function (i, item) {
            let tr = $("<tr>");
            tr.attr('data-id', item.id);

            // Loop through the values and populate cells, excluding "salt" and "hashed_pw"
            $.each(item, function (key, val) {
                if (key !== "salt" && key !== "hashed_pw" && key !== "picture") {
                    let td = $("<td>");
                    td.text(val);
                    tr.append(td);
                }
            });

            // Add buttons for actions (View Detail, Edit, Delete) at the end of each row
            var button1 = $('<button type="button" class="btn btn-primary view-detail" data-id="' + item['id'] + '">').text("View Detail");
            var daucach1 = $('<br><br>'); // Add a space between buttons for better spacing
            var button2 = $('<button type="button" class="btn btn-primary edit" data-id="' + item['id'] + '">').text("Edit");
            var daucach2 = $('<br><br>'); // Add a space between buttons for better spacing
            var button3 = $('<button type="button" class="btn btn-danger delete" data-id="' + item['id'] + '">').text("Delete");
            var daucach3 = $('<br><br>');
            var button4 = $('<button type="button" class="btn btn-danger deletepermanent" data-id="' + item['id'] + '">').text("Delete Permanent");
            let tdAction = $("<td>").append(button1, daucach1, button2, daucach2, button3, daucach3, button4);
            tr.append(tdAction);
            tbody.append(tr);
        });
        table.append(tbody);
    });
}

function AddUser() {
    $('#addUser').show();
}

$(document).on('click', '.addUser', function () {
    // Use jQuery to get the value and trim spaces
    var email = $('#email').val().trim();
    var password = $('#password').val().trim();
    var fullname = $('#fullname').val().trim();

    // Check if email and password are not empty
    if (!email || !password) {
        alert("Email and password are required");
        return;
    }

    // Create the JSON payload
    var request = {
        full_name: fullname,
        email: email,
        password: password
    };

    // Make an AJAX request using the Fetch API
    fetch('https://localhost:44345/register/request', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify(request)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.registerResult) {
                alert("Registration successful");
                fetchUsers();
            } else {
                alert("Registration failed. Error message: " + data.errorMessage);
            }
            $('#addUser').hide();
        })
        .catch(error => {
            alert('Error during registration request: ' + error.message);
            $('#addUser').hide();
        });
    
});

// Close modal functionality
$(document).on('click', '.edit-botton', function () {
    $('#addUser').hide();
});

// Hide the modal when clicking outside of it
$(window).click(function (event) {
    if (event.target.id === 'addUser') {
        $('#addUser').hide();
    }
});

// Using on with event delegation for dynamically created elements
$(document).on('click', '.view-detail', function () {
    var productId = $(this).attr('data-id'); // Get the product id stored in data-id attribute
    $.get("https://localhost:44345/admin/getSv/" + productId, function (data) {
        // Expanded detailHtml to include more details
        var detailHtml = `
            <p><strong>id:</strong> ${data[0].id} </p>
            <p><strong>Full_Name:</strong> ${data[0].full_name}</p>
            <p><strong>Mssv:</strong> ${data[0].mssv}</p>
            <p><strong>Gender:</strong> ${data[0].gender}</p>
            <p><strong>Birthday:</strong> ${data[0].birthday}</p>
            <p><strong>Email:</strong> ${data[0].email}</p>
            <p><strong>Phone:</strong> ${data[0].myphone}</p>
            <p><strong>Address:</strong> ${data[0].address}</p>
            <p><strong>Role:</strong> ${data[0].role}</p>
            <p><strong>Is Deleted:</strong> ${data[0].isdeleted}</p>
            <p><strong>Id Card:</strong> ${data[0].idcard}</p>
            <p><strong>Date Of Issue:</strong> ${data[0].dateofissue}</p>
            <p><strong>Faculty:</strong> ${data[0].faculty}</p>
            <p><strong>Major:</strong> ${data[0].major}</p>
            <p><strong>Picture:</strong> ${data[0].picture}</p>`;

        $('#userDetail').html(detailHtml);
        $('#detailModal').show(); // Show the modal with the product details
    });
});

// Close modal functionality
$(document).on('click', '.close-button', function () {
    $('#detailModal').hide();
});

// Hide the modal when clicking outside of it
$(window).click(function (event) {
    if (event.target.id === 'detailModal') {
        $('#detailModal').hide();
    }
});

// Edit product functionality
$(document).on('click', '.edit', function () {
    var productId = $(this).attr('data-id');
    $.get("https://localhost:44345/admin/getSv/" + productId, function (product) {
        $('#editid').val(product[0].id);
        $('#editfull_name').val(product[0].full_name);
        $('#editmssv').val(product[0].mssv);
        $('#editgender').val(product[0].gender);
        $('#editbirthday').val(product[0].birthday);
        $('#editemail').val(product[0].email);
        $('#editmyphone').val(product[0].myphone);
        $('#editaddress').val(product[0].address);
        $('#editrole').val(product[0].role);
        $('#editisdeleted').val(product[0].isdeleted);
        $('#editidcard').val(product[0].idcard);
        $('#editdateofissue').val(product[0].dateofissue);
        $('#editfaculty').val(product[0].faculty);
        $('#editmajor').val(product[0].major);
        $('#editpicture').val(product[0].picture);
    });
    var form = $("#edituserForm");

    // Create and append the "Save Changes" button
    var button = '<button class="saveEdit btn btn-primary" type="button" id="saveEdit" data-id="' + productId + '">Save Changes</button>';
    form.append(button);

    // Show the edit product modal
    $('#editUser').show();
});

// Close modal functionality
$(document).on('click', '.edit-botton', function () {
    var button = $('#saveEdit');
    button.remove();
    $('#editUser').hide();
});

// Hide the modal when clicking outside of it
$(window).click(function (event) {
    if (event.target.id === 'editUser') {
        var button = $('#saveEdit');
        button.remove();
        $('#editUser').hide();
    }
});

// Save changes
$(document).on('click', '.saveEdit', function () {
    var productId = $(this).attr('data-id');
    var isDeleted = $('#editisdeleted').val().toString();
    var updateduser = {
        "full_name": $('#editfull_name').val(),
        "mssv": $('#editmssv').val(),
        "gender": $('#editgender').val(),
        "birthday": $('#editbirthday').val(),
        "faculty": $('#editfaculty').val(),
        "major": $('#editmajor').val(),
        "idcard": $('#editidcard').val(),
        "dateofissue": $('#editdateofissue').val(),
        "myphone": $('#editmyphone').val(),
        "email": $('#editemail').val(),
        "address": $('#editaddress').val(),
        "isdeleted": isDeleted,
        "role": $('#editrole').val(),
        "picture": $('#editpicture').val(),
    };

    fetch('https://localhost:44345/admin/update/' + productId, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateduser)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            let jsonData = data;
            alert('Updated User details successfully!!');
            $('#editUser').hide();
            fetchUsers();

            // Remove the "Save Changes" button
            $(this).remove();
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
});

// Delete product
$(document).on('click', '.delete', function () {
    var productId = $(this).attr('data-id');

    var updateduser = {
        "isdeleted": true,
    };
    if (confirm("Are you sure you want to delete this product?")) {
        fetch('https://localhost:44345/admin/delete/' + productId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateduser)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                let jsonData = data;
                if (jsonData.updateResult)
                {
                    alert('Product deleted successfully!!');
                    fetchUsers();
                }
                else
                    alert('Product deleted Fail!!');
            })
            .catch(error => {
                console.error('There was a problem with your fetch operation:', error);
            });
    }
});


// Delete product
$(document).on('click', '.deletepermanent', function () {
    var productId = $(this).attr('data-id');

    var updateduser = {
        "isdeleted": true,
    };
    if (confirm("Are you sure you want to delete this product permanently?")) {
        fetch('https://localhost:44345/admin/deletepermanent/' + productId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateduser)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                let jsonData = data;
                if (jsonData.updateResult) {
                    alert('Product  deleted permanently successfully!!');
                    fetchUsers();
                }
                else
                    alert('Product deleted Fail!!');
            })
            .catch(error => {
                console.error('There was a problem with your fetch operation:', error);
            });
    }
});

