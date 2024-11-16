function fetchmonhoc() {
    $.get("https://localhost:44345/monhoc/getmonhoc", function (data, status) {
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
            item = item[0].toUpperCase() + item.slice(1);

            let th = $('<th scope="col">');
            th.text(item);
            tr.append(th);

        });
        thead.append(tr);
        table.append(thead);

        // Populate table rows with user data
        $.each(jsonData, function (i, item) {
            let tr = $("<tr>");
            tr.attr('data-id', item.IdMonhoc);

            // Loop through the values and populate cells, excluding "salt" and "hashed_pw"
            $.each(item, function (key, val) {

                let td = $("<td>");
                td.text(val);
                tr.append(td);

            });

            // Add buttons for actions (View Detail, Edit, Delete) at the end of each row
            var button1 = $('<button type="button" class="btn btn-primary view-detailmonhoc" data-id="' + item['IdMonhoc'] + '">').text("View Detail");
            var daucach1 = $('<br><br>'); // Add a space between buttons for better spacing
            var button2 = $('<button type="button" class="btn btn-primary editmonhoc" data-id="' + item['IdMonhoc'] + '">').text("Edit");
            var daucach2 = $('<br><br>'); // Add a space between buttons for better spacing
            var button3 = $('<button type="button" class="btn btn-danger deletemonhoc" data-id="' + item['IdMonhoc'] + '">').text("Delete");
            let tdAction = $("<td>").append(button1, daucach1, button2, daucach2, button3);
            tr.append(tdAction);
            tbody.append(tr);
        });
        table.append(tbody);
    });
}
//add mon hoc
function AddBook() {
    $('#addBook').show();
}

$(document).on('click', '.addBook', function () {
    // Use jQuery to get the value and trim spaces
    var IdMonHoc = $('#IdMonhoc').val().trim();
    var TitleMonhoc = $('#TitleMonhoc').val().trim();
    var ContentMonhoc = $('#ContentMonhoc').val().trim();

    // Check if email and password are not empty
    if (!IdMonHoc || !TitleMonhoc) {
        alert("IdMonHoc and TitleMonhoc are required");
        return;
    }

    // Create the JSON payload
    var request = {
        IdMonHoc: IdMonHoc,
        TitleMonhoc: TitleMonhoc,
        ContentMonhoc: ContentMonhoc
    };

    // Make an AJAX request using the Fetch API
    fetch('https://localhost:44345/monhoc/addmonhoc', {
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
            if (data.updateResult) {
                alert("Add mon Hoc successful");
                fetchmonhoc();
            } else {
                alert("Add mon hoc failed. Error message: " + data.errorMessage);
            }
            $('#addBook').hide();
        })
        .catch(error => {
            alert('Error during add mon hoc request: ' + error.message);
            $('#addBook').hide();
        });

});

// Close modal functionality
$(document).on('click', '.edit-botton', function () {
    $('#addBook').hide();
});

// Hide the modal when clicking outside of it
$(window).click(function (event) {
    if (event.target.id === 'addBook') {
        $('#addBook').hide();
    }
});



// Using on with event delegation for dynamically created elements
$(document).on('click', '.view-detailmonhoc', function () {
    var productId = $(this).attr('data-id'); // Get the product id stored in data-id attribute

    $.get("https://localhost:44345/monhoc/getmotmh/" + productId, function (data) {
        // Expanded detailHtml to include more details
        var detailHtml = `
            <p><strong>IdMonhoc:</strong> ${data[0].IdMonhoc} </p>
            <p><strong>Tên Môn Học:</strong> ${data[0].TitleMonhoc}</p>
            <p><strong>Nội Dung:</strong> ${data[0].ContentMonhoc}</p>`;

        $('#MONHOCDetail').html(detailHtml);
        $('#detailMonhoc').show(); // Show the modal with the product details
    });
});

// Close modal functionality
$(document).on('click', '.close-button', function () {
    $('#detailMonhoc').hide();
});

// Hide the modal when clicking outside of it
$(window).click(function (event) {
    if (event.target.id === 'detailMonhoc') {
        $('#detailMonhoc').hide();
    }
});

// Edit product functionality
$(document).on('click', '.editmonhoc', function () {
    var productId = $(this).attr('data-id');
    $.get("https://localhost:44345/monhoc/getmotmh/" + productId, function (product) {
        $('#editIdMonhoc').val(product[0].IdMonhoc);
        $('#editTitleMonhoc').val(product[0].TitleMonhoc);
        $('#editContentMonhoc').val(product[0].ContentMonhoc);
    });
    var form = $("#editMonhocForm");

    // Create and append the "Save Changes" button
    var button = '<button class="saveChange2 btn btn-primary" type="button" id="saveChange2" data-id="' + productId + '">Save Changes</button>';
    form.append(button);

    // Show the edit product modal
    $('#editMonhoc').show();
});

// Close modal functionality
$(document).on('click', '.edit-botton', function () {
    var button = $('#saveChange2');
    button.remove();
    $('#editMonhoc').hide();
});

// Hide the modal when clicking outside of it
$(window).click(function (event) {
    if (event.target.id === 'editMonhoc') {
        var button = $('#saveChange2');
        button.remove();
        $('#editMonhoc').hide();
    }
});

// Save changes
$(document).on('click', '.saveChange2', function () {
    var productId = $(this).attr('data-id');
    var updateduser = {
        "IdMonhoc": $('#editIdMonhoc').val(),
        "TitleMonhoc": $('#editTitleMonhoc').val(),
        "ContentMonhoc": $('#editContentMonhoc').val(),
    };

    fetch('https://localhost:44345/monhoc/update/' + productId, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
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
            alert('Updated Mon Hoc details successfully!!');
            $('#editMonhoc').hide();
            fetchmonhoc();

            // Remove the "Save Changes" button
            $(this).remove();
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
});

// Delete product
$(document).on('click', '.deletemonhoc', function () {
    var productId = $(this).attr('data-id');

    var updateduser = {
        "isdeleted": true,
    };
    if (confirm("Are you sure you want to delete this Mon Hoc?")) {
        fetch('https://localhost:44345/monhoc/delete/' + productId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
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
                    alert('Mon Hoc deleted successfully!!');
                    fetchmonhoc();
                }
                else
                    alert('Mon Hoc deleted Fail!!');
            })
            .catch(error => {
                console.error('There was a problem with your fetch operation:', error);
            });
    }
});

//Chapters data
function fetchchapters() {
    $.get("https://localhost:44345/monhoc/getchuong/CTGT01", function (data, status) {
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
            item = item[0].toUpperCase() + item.slice(1);

            let th = $('<th scope="col">');
            th.text(item);
            tr.append(th);

        });
        thead.append(tr);
        table.append(thead);

        // Populate table rows with user data
        $.each(jsonData, function (i, item) {
            let tr = $("<tr>");
            tr.attr('data-id', item.Id);

            // Loop through the values and populate cells, excluding "salt" and "hashed_pw"
            $.each(item, function (key, val) {

                let td = $("<td>");
                td.text(val);
                tr.append(td);

            });

            // Add buttons for actions (View Detail, Edit, Delete) at the end of each row
            var button1 = $('<button type="button" class="btn btn-primary view-detailchuong" data-id="' + item['Id'] + '">').text("View Detail");
            var daucach1 = $('<br><br>'); // Add a space between buttons for better spacing
            var button2 = $('<button type="button" class="btn btn-primary editchuong" data-id="' + item['Id'] + '">').text("Edit");
            var daucach2 = $('<br><br>'); // Add a space between buttons for better spacing
            var button3 = $('<button type="button" class="btn btn-danger deletechuong" data-id="' + item['Id'] + '">').text("Delete");
            let tdAction = $("<td>").append(button1, daucach1, button2, daucach2, button3);
            tr.append(tdAction);
            tbody.append(tr);
        });
        table.append(tbody);
    });
}

//add Chuong
function AddChapter() {
    $('#addChapter').show();
}

$(document).on('click', '.addChapter', function () {
    // Use jQuery to get the value and trim spaces
    var Id = $('#Id').val().trim();
    var Title = $('#Title').val().trim();
    var IdMonhoc = $('#IdMonhoc1').val().trim();
    var ParentId = $('#ParentId').val().trim();

    // Check if Id, ParentId, and IdMonhoc are required
    if (!Id || !ParentId || !IdMonhoc) {
        alert("Id, ParentId, and IdMonhoc are required");
        return;
    }

    // Create the JSON payload
    var request = {
        Id: Id,
        Title: Title,
        IdMonhoc: IdMonhoc,
        ParentId: ParentId
    };

    // Make an AJAX request using the Fetch API
    fetch('https://localhost:44345/monhoc/addchuong', {
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
            if (data.updateResult) {
                alert("Add Chapter successful");
                fetchchapters();
            } else {
                alert("Add Chapter failed. Error message: " + data.errorMessage);
            }
            $('#addChapter').hide();
        })
        .catch(error => {
            alert('Error during add mon hoc request: ' + error.message);
            $('#addChapter').hide();
        });

});


// Close modal functionality
$(document).on('click', '.edit-botton', function () {
    $('#addChapter').hide();
});

// Hide the modal when clicking outside of it
$(window).click(function (event) {
    if (event.target.id === 'addChapter') {
        $('#addChapter').hide();
    }
});

// Using on with event delegation for dynamically created elements
$(document).on('click', '.view-detailchuong', function () {
    var productId = $(this).attr('data-id'); // Get the product id stored in data-id attribute

    $.get("https://localhost:44345/monhoc/getmotchuong/" + productId, function (data) {
        // Expanded detailHtml to include more details
        var detailHtml = `
            <p><strong>Id:</strong> ${data[0].Id} </p>
            <p><strong>Tên Chương:</strong> ${data[0].Title}</p>
            <p><strong>IdMonhoc:</strong> ${data[0].IdMonhoc} </p>
            <p><strong>ParentId:</strong> ${data[0].ParentId}</p>`;

        $('#ChuongDetail').html(detailHtml);
        $('#detailChuong').show(); // Show the modal with the product details
    });
});

// Close modal functionality
$(document).on('click', '.close-button', function () {
    $('#detailChuong').hide();
});

// Hide the modal when clicking outside of it
$(window).click(function (event) {
    if (event.target.id === 'detailChuong') {
        $('#detailChuong').hide();
    }
});

// Edit product functionality
$(document).on('click', '.editchuong', function () {
    var productId = $(this).attr('data-id');
    $.get("https://localhost:44345/monhoc/getmotchuong/" + productId, function (product) {
        $('#editId').val(product[0].Id);
        $('#editTitle').val(product[0].Title);
        $('#editIdMonhoc1').val(product[0].IdMonhoc);
        $('#editParentId').val(product[0].ParentId);
    });
    var form = $("#editChuongForm");

    // Create and append the "Save Changes" button
    var button = '<button class="saveChange1 btn btn-primary" type="button" id="saveChange1" data-id="' + productId + '">Save Changes</button>';
    form.append(button);

    // Show the edit product modal
    $('#editChuong').show();
});

// Close modal functionality
$(document).on('click', '.edit-botton', function () {
    var button = $('#saveChange1');
    button.remove();
    $('#editChuong').hide();
});

// Hide the modal when clicking outside of it
$(window).click(function (event) {
    if (event.target.id === 'editChuong') {
        var button = $('#saveChange1');
        button.remove();
        $('#editChuong').hide();
    }
});

// Save changes
$(document).on('click', '.saveChange1', function () {
    var productId = $(this).attr('data-id');
    var updateduser = {
        "Id": $('#editId').val(),
        "Title": $('#editTitle').val(),
        "IdMonhoc": $('#editIdMonhoc1').val(),
        "ParentId": $('#editParentId').val(),
    };

    fetch('https://localhost:44345/monhoc/updatechuong/' + productId, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
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
            alert('Updated Chuong details successfully!!');
            $('#editChuong').hide();
            fetchchapters();

            // Remove the "Save Changes" button
            $(this).remove();
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
});

// Delete product
$(document).on('click', '.deletechuong', function () {
    var productId = $(this).attr('data-id');

    var updateduser = {
        "isdeleted": true,
    };
    if (confirm("Are you sure you want to delete this Chuong?")) {
        fetch('https://localhost:44345/monhoc/deletechuong/' + productId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
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
                    alert('Chuong deleted successfully!!');
                    fetchchapters();
                }
                else
                    alert('Chuong deleted Fail!!');
            })
            .catch(error => {
                console.error('There was a problem with your fetch operation:', error);
            });
    }
});

