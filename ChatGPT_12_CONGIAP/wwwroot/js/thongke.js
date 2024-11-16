function toAdjustedLocalISODate(date) {
    const offset = date.getTimezoneOffset() * 60000; // Convert date
    const localDate = new Date(date.getTime() - offset); // Adjust to  local time 
    return localDate.toISOString().split('T')[0];
}
function fetchtruyvan() {
    // Fetch data for the first table
    $.get("https://localhost:44345/admin/gettruyvan", function (data, status) {
        if (status !== "success") {
            console.error("Failed to fetch data for the first table");
            return;
        }

        // Extract JSON data
        var jsonData = data;

        // Create or clear the first table element
        let table1 = $("#userTable");
        table1.empty();

        // If no data is returned, display a message or handle it as needed
        if (jsonData.length === 0) {
            table1.append("<p>No data available</p>");
            return;
        }

        // Get the keys (column names) and add an "Action" column
        let cols = Object.keys(jsonData[0]);
        cols.push("Action");

        // Create the header for the first table
        let thead = $("<thead>");
        let tr = $("<tr>");
        $.each(cols, function (i, item) {
            item = item[0].toUpperCase() + item.slice(1);
            let th = $('<th scope="col">').text(item);
            tr.append(th);
        });
        thead.append(tr);
        table1.append(thead);

        // Create the body for the first table
        let tbody = $('<tbody id="tbody">');
        $.each(jsonData, function (i, item) {
            let tr = $("<tr>").attr('data-id', item.TruyVanId);
            // Populate cells
            $.each(item, function (key, val) {
                let td = $("<td>").text(val);
                tr.append(td);
            });
            // Add buttons for actions at the end of each row
            var deleteButton = $('<button type="button" class="btn btn-danger delete" data-id="' + item['TruyVanId'] + '">').text("Delete");
            let tdAction = $("<td>").append(deleteButton);
            tr.append(tdAction);
            tbody.append(tr);
        });
        table1.append(tbody);
    }).fail(function () {
        console.error("Failed to fetch data for the first table");
    });
    
}
function fetchtruyvancauhoi() {
    $.get("https://localhost:44345/admin/gettruyvancauhoi", function (data1, status) {
        if (status !== "success") {
            console.error("Failed to fetch data for the second table");
            return;
        }

        // Extract JSON data
        var jsonData1 = data1;
        // Create the table element
        let table = $("#userTable");
        table.empty();

        // Get the keys names
        let cols = Object.keys(jsonData1[0]);

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
        $.each(jsonData1, function (i, item) {
            let tr = $("<tr>");
            $.each(item, function (key, val) {
                let td = $("<td>");
                td.text(val);
                tr.append(td);
            });
            tbody.append(tr);
        });
        table.append(tbody);
    });
}


// Delete product
$(document).on('click', '.delete', function () {
    var productId = $(this).attr('data-id');

    var updateduser = {
        "isdeleted": true,
    };
    if (confirm("Are you sure you want to delete this Truy Van permanently?")) {
        fetch('https://localhost:44345/admin/deletetruyvan/' + productId, {
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
                    alert('truy van  deleted permanently successfully!!');
                    fetchtruyvan();
                }
                else
                    alert('Product deleted Fail!!');
            })
            .catch(error => {
                console.error('There was a problem with your fetch operation:', error);
            });
    }
});



$(document).on('click', '.thongketruyvan', function () {
    var Ngay = $('#ngay').val().trim();
    $.get("https://localhost:44345/admin/gettruyvan/" + Ngay, function (data, status) {
        var jsonData = data;

        // Create the table element
        let table = $("#userTable");
        table.empty();

        // Get the keys names
        let cols = Object.keys(jsonData[0]);

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
            tr.attr('data-id', item.TruyVanId);

            // Loop through the values and populate cells, excluding "salt" and "hashed_pw"
            $.each(item, function (key, val) {
                let td = $("<td>");
                if (key === "ThoiGian") {
                    // Check if val needs to be converted to a Date object
                    if (typeof val === 'string') {
                        const date = new Date(val);
                        val = toAdjustedLocalISODate(date);
                    } else if (val instanceof Date) {
                        val = toAdjustedLocalISODate(val);
                    }
                    td.text(val);
                } else {
                    td.text(val);
                }
                tr.append(td);
            });
            tbody.append(tr);
        });
        table.append(tbody);
    });
});

//theo thang

$(document).on('click', '.thongketruyvanthang', function () {
    var month = $('#month').val().trim();
    var year = $('#year').val().trim();
    $.get("https://localhost:44345/admin/gettruyvan/"+ year+"/"+month, function (data, status) {
        var jsonData = data;

        // Create the table element
        let table = $("#userTable");
        table.empty();

        // Get the keys names
        let cols = Object.keys(jsonData[0]);

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
            tr.attr('data-id', item.TruyVanId);

            // Loop through the values and populate cells, excluding "salt" and "hashed_pw"
            $.each(item, function (key, val) {
                let td = $("<td>");
                if (key === "ThoiGian") {
                    // Check if val needs to be converted to a Date object
                    if (typeof val === 'string') {
                        const date = new Date(val);
                        val = toAdjustedLocalISODate(date);
                    } else if (val instanceof Date) {
                        val = toAdjustedLocalISODate(val);
                    }
                    td.text(val);
                } else {
                    td.text(val);
                }
                tr.append(td);
            });
            tbody.append(tr);
        });
        table.append(tbody);
    });
});


//thong ke dang nhap


function fetchdangnhap() {
    $.get("https://localhost:44345/admin/getdangnhap", function (data, status) {
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
            tr.attr('data-id', item.DangNhapId);

            // Loop through the values and populate cells, excluding "salt" and "hashed_pw"
            $.each(item, function (key, val) {

                let td = $("<td>");
                td.text(val);
                tr.append(td);

            });
            // Add buttons for actions (View Detail, Edit, Delete) at the end of each row

            var button4 = $('<button type="button" class="btn btn-danger delete1" data-id="' + item['DangNhapId'] + '">').text("Delete");
            let tdAction = $("<td>").append(button4);
            tr.append(tdAction);
            tbody.append(tr);

        });
        table.append(tbody);
    });
}

// Delete product
$(document).on('click', '.delete1', function () {
    var productId = $(this).attr('data-id');

    var updateduser = {
        "isdeleted": true,
    };
    if (confirm("Are you sure you want to delete this Dang Nhap permanently?")) {
        fetch('https://localhost:44345/admin/deletedangnhap/' + productId, {
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
                    alert('Dang Nhap  deleted permanently successfully!!');
                    fetchdangnhap();
                }
                else
                    alert('Product deleted Fail!!');
            })
            .catch(error => {
                console.error('There was a problem with your fetch operation:', error);
            });
    }
});



$(document).on('click', '.thongkedangnhap', function () {
    var Ngay = $('#ngay1').val().trim();
    $.get("https://localhost:44345/admin/getdangnhap/" + Ngay, function (data, status) {
        var jsonData = data;

        // Create the table element
        let table = $("#userTable");
        table.empty();
        

        // Get the keys names
        let cols = Object.keys(jsonData[0]);

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
            tr.attr('data-id', item.DangNhapId);

            // Loop through the values and populate cells, excluding "salt" and "hashed_pw"
            $.each(item, function (key, val) {
                let td = $("<td>");
                if (key === "login_day") {
                    // Check if val needs to be converted to a Date object
                    if (typeof val === 'string') {
                        const date = new Date(val);
                        val = toAdjustedLocalISODate(date);
                    } else if (val instanceof Date) {
                        val = toAdjustedLocalISODate(val);
                    }
                    td.text(val);
                } else {
                    td.text(val);
                }
                tr.append(td);
            });
            tbody.append(tr);
        });
        table.append(tbody);
    });
});

//theo thang

$(document).on('click', '.thongkedangnhapthang', function () {
    var year = $('#year1').val().trim();
    var month = $('#month1').val().trim();
    $.get("https://localhost:44345/admin/getdangnhap/" + year + "/" + month, function (data, status) {
        var jsonData = data;

        // Create the table element
        let table = $("#userTable");
        table.empty();


        // Get the keys names
        let cols = Object.keys(jsonData[0]);

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
            tr.attr('data-id', item.DangNhapId);

            // Loop through the values and populate cells, excluding "salt" and "hashed_pw"
            $.each(item, function (key, val) {
                let td = $("<td>");
                if (key === "login_day") {
                    // Check if val needs to be converted to a Date object
                    if (typeof val === 'string') {
                        const date = new Date(val);
                        val = toAdjustedLocalISODate(date);
                    } else if (val instanceof Date) {
                        val = toAdjustedLocalISODate(val);
                    }
                    td.text(val);
                } else {
                    td.text(val);
                }
                tr.append(td);
            });
            tbody.append(tr);
        });
        table.append(tbody);
    });
});

