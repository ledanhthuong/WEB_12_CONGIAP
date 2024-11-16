async function getsinhvienbyemail(email) {

    const url = 'https://localhost:44345/sinhvien/getByEmail/' + email;

    try {
        const response = await fetch(url);
        // Check if the request was successful
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        return data[0].id;
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
}
function createSendMessage(type, sender, message) {
    var messageElement = document.createElement("div");
    messageElement.classList.add("message", type);
    var messageContent = `
        <p class="message-sender">
            <i class="fa-regular fa-user"></i>${sender}_${getCurrentTime()}:</p>
        <p class="message-text">${message}</p>`;
    messageElement.innerHTML = messageContent;
    return messageElement;
}

function createMessageElement(type, sender, message) {
    var messageElement = document.createElement("div");
    messageElement.classList.add("message", type);
    var messageContent = `
        <p class="message-sender">
            <i class="fa-solid fa-robot"></i>${sender}_${getCurrentTime()}:</p>
        <p class="message-text">${message}</p>`;
    messageElement.innerHTML = messageContent;
    return messageElement;
}

async function fetchchatbox() {
    $.get("https://localhost:44345/admin/gettruyvan", async function (data, status) {
        var jsonData = data;
        const messages = document.getElementById("messages");
        const email = localStorage.getItem('username');
        const ID = await getsinhvienbyemail(email);

        // Loop through the data array
        jsonData.forEach(function (item) {
            if (item.id === ID) {
                // Create user message element
                const userMessageElement = createSendMessage("sent", "User", item.TruyVanText);
                messages.appendChild(userMessageElement);
                // Create bot message element
                const botMessageElement = createMessageElement("received", "Bot_Assistant", item.TraLoiText);
                messages.appendChild(botMessageElement);
            }
        });
    });
}


window.onload = function () {
    fetchchatbox();
};