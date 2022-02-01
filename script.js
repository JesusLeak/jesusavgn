const subscribers = document.getElementById("subscribers");
const msgContainer = document.getElementsByClassName('messagesContainer')[0];
const pageNumberButtons = document.getElementsByClassName('pageNumber');
let page = 0;
let scrollZoom = 0;
const scrollZoomLimit = 50;

const zoomContainer = document.getElementsByClassName('zoomContainer')[0];
zoomContainer.onclick = function () {
    CloseZoomContainer();
}

window.addEventListener('scroll', function () {
    if (Math.abs(document.documentElement.scrollTop - scrollZoom) > scrollZoomLimit) {
        CloseZoomContainer();
    }
});

document.getElementById('firstPageButton').onclick = function () {
    if (page != 0) {
        LoadMessages(0);
    }
}
document.getElementById('previousPageButton').onclick = function () {
    if (page > 0) {
        LoadMessages(--page);
    }
}
document.getElementById('nextPageButton').onclick = function () {
    if (page < GetLastPageIndex()) {
        LoadMessages(++page);
    }
}
document.getElementById('lastPageButton').onclick = function () {
    if (page != GetLastPageIndex()) {
        LoadMessages(GetLastPageIndex());
    }
}

function LoadMessages(pageNumber) {
    page = pageNumber;
    UpdatePagesNavigation();
    msgContainer.innerHTML = '';
    const startMessageIndex = pageNumber * messagesPerPage;
    for (let i = startMessageIndex; i < startMessageIndex + messagesPerPage && i < messages.length; i++) {
        const msg = messages[i];
        let msgString = '';
        msgString += `<div class="message">`;
        if (msg.media.length > 0) {
            msgString += `<div class="media">`;
            msg.media.forEach(m => {
                if (m.startsWith('vid')) {
                    msgString += m.substring(4);
                }
            });
            msg.media.forEach(m => {
                if (m.startsWith('pic')) {
                    msgString += `<div class="picWrapper"><img class="zoom" src="${m.substring(4)}"></div>`
                }
            });
            msgString += `</div>`;
        }
        if (msg.text) {
            msgString += `<div class="text">`;
            msgString += msg.text;
            msgString += `</div>`;
        }
        const date = new Date(msg.date * 1000);
        const months = ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'];
        msgString += `<div class="date">${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}</div>`;

        msgString += `</div>`;
        msgContainer.innerHTML += msgString;
    }
    const zoomImages = document.getElementsByClassName('zoom');
    for (var i = 0, len = zoomImages.length; i < len; i++) {
        zoomImages[i].onclick = function (event) {
            zoomContainer.style.visibility = "visible";
            scrollZoom = document.documentElement.scrollTop;
            let image = document.createElement("img");
            image.src = event.target.src;
            zoomContainer.appendChild(image);
        }
    }
}

function CloseZoomContainer() {
    zoomContainer.innerHTML = '';
    zoomContainer.style.visibility = "hidden";
}

function GetLastPageIndex() {
    return Math.ceil(messages.length / messagesPerPage) - 1;
}

function UpdatePagesNavigation() {
    const pageNumbers = document.getElementsByClassName('pageNumber');
    while (pageNumbers.length > 0) {
        pageNumbers[0].parentNode.removeChild(pageNumbers[0]);
    }
    const referenceElement = document.getElementById('nextPageButton');

    let startPageIndex = 0;
    let endPageIndex = 0;
    if (GetLastPageIndex() <= 4) {
        endPageIndex = GetLastPageIndex();
    }
    else {
        let a = page - 2;
        if (a <= 0) {
            startPageIndex = 0;
            endPageIndex = 4;
        }
        else {
            if (page + 2 <= GetLastPageIndex()) {
                startPageIndex = a;
                endPageIndex = page + 2;
            }
            else {
                startPageIndex = a - (page + 2 - GetLastPageIndex())
                endPageIndex = GetLastPageIndex();
            }
        }
    }

    for (let p = startPageIndex; p <= endPageIndex; p++) {
        let pageButton = document.createElement('span');
        pageButton.classList.add("pageNumber");
        if (p == page) {
            pageButton.classList.add("selected");
        }
        pageButton.innerHTML = p + 1;
        pageButton.onclick = function () {
            LoadMessages(p);
        }
        referenceElement.parentNode.insertBefore(pageButton, referenceElement);
    }
}

subscribers.innerHTML = `${subscribersCount} подписчиков`;
LoadMessages(0);