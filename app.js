const $list = document.getElementById('list');
const $listContainer = document.getElementsByClassName('listContainer')[0];
const $hideModalBtn = document.querySelector('.modalContainer .modalHeading #close');
const $modal = document.querySelector('.modalContainer');

$listContainer.addEventListener('click', handle);

async function handle(e) {
    if (e.target.tagName === 'I') {
        if (e.target.id == 'options') {
            const list = e.target.parentElement.parentElement;
            const listId = list.id;
            await deleteList(listId);
            renderUI();
        } else if (e.target.id === 'toggle') {
            console.log('toggle')
        } else {
            return;
        }
    } else if (e.target.tagName === 'INPUT') {
        if (e.target.parentElement.className === 'cardHeading' || e.target.parentElement.className === 'modalHeading') {
            e.target.readOnly = false;
            e.target.style.backgroundColor = 'white';
        } else {
            handleCurrentCard(e);
            $modal.style.display = 'block';
        }
    } else if (e.target.tagName === 'BUTTON') {
        addNewCard(e);
    } else {
        return;
    }
}

function hideModal(e) {
    $modal.style.display = 'none';
    renderUI();
}

function changeUI(data) {
    console.log(data);
}


async function deleteList(listId) {
    const response = await fetch(`https://api.trello.com/1/lists/${listId}/closed?value=true&key=92bca003422f39393b116d6837389c0a&token=d2eeb8439feca80f5784d731fb5dd6bc621d6c31bb702dd6104e57b11d8a696c`, {
        method: 'PUT'
    });

    let data = await response.json();
    return data;
}
async function fetchLists() {
    try {

        const response = await fetch(`https://api.trello.com/1/boards/9yAm8zpl/lists?key=92bca003422f39393b116d6837389c0a&token=d2eeb8439feca80f5784d731fb5dd6bc621d6c31bb702dd6104e57b11d8a696c`);

        const lists = await response.json();
        return lists;
    } catch (err) {
        console.log(err.message);
    }
}
async function fetchCards() {
    const res = await fetch('https://api.trello.com/1/boards/9yAm8zpl/cards?key=92bca003422f39393b116d6837389c0a&token=d2eeb8439feca80f5784d731fb5dd6bc621d6c31bb702dd6104e57b11d8a696c');

    const cards = await res.json();
    return cards;
}

async function fetchSingleCard(cardId) {
    const options = {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    }

    const response = await fetch(`https://api.trello.com/1/cards/${cardId}?key=92bca003422f39393b116d6837389c0a&token=d2eeb8439feca80f5784d731fb5dd6bc621d6c31bb702dd6104e57b11d8a696c`, options);
    const card = await response.json();
    return card;
}
async function changeCardData(id, body) {
    const options = {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        }
    }
    return await fetch(`https://api.trello.com/1/cards/${id}?key=92bca003422f39393b116d6837389c0a&token=d2eeb8439feca80f5784d731fb5dd6bc621d6c31bb702dd6104e57b11d8a696c`, options);
}
async function fetchABoard() {
    const options = {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    }
    const response = await fetch(`https://api.trello.com/1/boards/9yAm8zpl?key=92bca003422f39393b116d6837389c0a&token=d2eeb8439feca80f5784d731fb5dd6bc621d6c31bb702dd6104e57b11d8a696c`, options);
    const card = await response.json();
    return card;
}
async function createANewList(id, value) {
    const options = {
        method: "POST",
        body: JSON.stringify({
            name: value
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }
    const response = await fetch(`https://api.trello.com/1/lists?idBoard=${id}&key=92bca003422f39393b116d6837389c0a&token=d2eeb8439feca80f5784d731fb5dd6bc621d6c31bb702dd6104e57b11d8a696c`, options);
    const list = await response.json();
    console.log(list);
    return list;
}
async function fetchActionsOfACard(cardId) {
    // https://api.trello.com/1/cards/6235ce839ec24f4a4af438b5/actions?key=92bca003422f39393b116d6837389c0a&token=d2eeb8439feca80f5784d731fb5dd6bc621d6c31bb702dd6104e57b11d8a696c
    const options = {
        method: "GET",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }
    const response = await fetch(`https://api.trello.com/1/cards/${cardId}/actions?key=92bca003422f39393b116d6837389c0a&token=d2eeb8439feca80f5784d731fb5dd6bc621d6c31bb702dd6104e57b11d8a696c`, options);
    const actions = await response.json();
    return actions;
}

function getCommentInfo(actions) {
    const commentInfo = [];
    for (let index = 0; index < actions.length; index++) {
        commentInfo.push({
            id: actions[index].id,
            text: actions[index].data.text,
            avatarUrl: actions[index].memberCreator.avatarUrl,
            fullName: actions[index].memberCreator.fullName,
        })
    }
    return commentInfo;
}

function handlehover(e) {
    e.lastChild.previousElementSibling.style.display = 'inline';
}

function handleOut(e) {
    e.lastChild.previousElementSibling.style.display = 'none';
}

function addDescription(e) {
    const buttons = e.target.nextElementSibling;
    buttons.style.display = 'block';
}

function closeDescription(e) {
    const buttons = e.target.parentElement;
    const textArea = e.target.parentElement.previousElementSibling;
    const p = e.target.parentElement.previousElementSibling.previousElementSibling;
    buttons.style.display = textArea.style.display = 'none';
    p.style.display = 'block';
}

async function saveDescription(e) {
    const p = e.target.parentElement.previousElementSibling.previousElementSibling;
    const textArea = e.target.parentElement.previousElementSibling;
    const buttons = e.target.parentElement;
    const value = textArea.value;
    const id = e.target.parentElement.parentElement.parentElement.id;
    const body = {
        desc: value
    }
    const actions = await fetchActionsOfACard(id);
    const commentInfo = getCommentInfo(actions);
    changeCardData(id, body).then(response => response.json()).then(card => renderModal({
        id: card.id,
        title: card.name,
        description: card.desc,
        commentInfo
    })).catch(err => console.log(err.message));
}

function editDescription(e) {
    const p = e.target.nextElementSibling;
    const textArea = e.target.nextElementSibling.nextElementSibling;
    const value = p.innerText;
    p.style.display = 'none';
    textArea.style.display = 'block';
    textArea.innerText = value;
}

async function saveModalTitle(e) {
    if (e.keyCode !== 13) return;

    const id = $modal.id;
    const value = e.target.value;
    const body = {
        name: value
    }
    const actions = await fetchActionsOfACard(id);
    const commentInfo = getCommentInfo(actions);
    changeCardData(id, body).then(response => response.json()).then(card => renderModal({
        id: card.id,
        title: card.name,
        description: card.desc,
        commentInfo
    })).catch(err => console.log(err.message));
}

function handleComment(e) {
    const button = e.target.nextElementSibling;
    button.style.display = 'block';
}

function changeButtonColor(e) {
    const value = e.target.value;
    if ((value.length === 1 && e.keyCode !== 8) || value.length === 0)
        e.target.nextElementSibling.classList.toggle('toggleStyle');

}
async function addCommentApi(id, value) {
    const options = {
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        }
    }
    const response = await fetch(`https://api.trello.com/1/cards/${id}/actions/comments?text=${value}&key=92bca003422f39393b116d6837389c0a&token=d2eeb8439feca80f5784d731fb5dd6bc621d6c31bb702dd6104e57b11d8a696c`, options);
    await response.json();
}
async function addComment(e) {
    try {
        const value = e.target.previousElementSibling.value;
        const id = $modal.id;
        await addCommentApi(id, value);
        const card = await fetchSingleCard(id);
        const actions = await fetchActionsOfACard(id);
        const commentInfo = getCommentInfo(actions);
        renderModal({
            id,
            title: card.name,
            description: card.desc,
            commentInfo
        });
    } catch (err) {
        console.log(err.message);
    }
}
async function getCardsOnAList(listId) {
    const response = await fetch(`https://api.trello.com/1/lists/${listId}/cards?key=92bca003422f39393b116d6837389c0a&token=d2eeb8439feca80f5784d731fb5dd6bc621d6c31bb702dd6104e57b11d8a696c`, {
        method: 'GET'
    });
    return response.json();
}

function openCommentBlock(e) {
    const textArea = e.target.parentElement.previousElementSibling.previousElementSibling;
    const buttons = e.target.parentElement.previousElementSibling;
    textArea.readOnly = false;
    buttons.style.display = 'block';
}

function closeEditor(e) {
    const textArea = e.target.parentElement.previousElementSibling;
    const buttons = e.target.parentElement;
    textArea.readOnly = true;
    buttons.style.display = 'none';
}

//Api not working modification required
async function editComment(e) {
    try {
        const value = e.target.parentElement.previousElementSibling.value;
        const id = $modal.id;
        const response = await fetch(`https://api.trello.com/1/actions/${id}/text?value=${value}&key=92bca003422f39393b116d6837389c0a&token=d2eeb8439feca80f5784d731fb5dd6bc621d6c31bb702dd6104e57b11d8a696c`, {
            method: 'PUT'
        });
        await response.json();
        const card = await fetchSingleCard(id);
        const actions = await fetchActionsOfACard(id);
        const commentInfo = getCommentInfo(actions);
        renderModal({
            id,
            title: card.name,
            description: card.desc,
            commentInfo
        });
    } catch (err) {
        console.log(err);
    }
}

async function deleteComment(e) {
    try {
        const commentId = e.target.parentElement.parentElement.parentElement.id;
        const cardId = $modal.id;
        const response = await fetch(`https://api.trello.com/1/cards/${cardId}/actions/${commentId}/comments?key=92bca003422f39393b116d6837389c0a&token=d2eeb8439feca80f5784d731fb5dd6bc621d6c31bb702dd6104e57b11d8a696c`, {
            method: 'DELETE'
        });
        await response.json();
        const card = await fetchSingleCard(cardId);
        const actions = await fetchActionsOfACard(cardId);
        const commentInfo = getCommentInfo(actions);
        renderModal({
            id: card.id,
            title: card.name,
            description: card.desc,
            commentInfo
        });
    } catch (err) {
        console.log(err);
    }
}

function singleComment({
    id,
    text,
    avatarUrl,
    fullName
}) {
    const comment = document.createElement('li');
    comment.setAttribute('id', id);
    const avatar = document.createElement('img');
    avatar.setAttribute('src', avatarUrl);

    const addCommentSection = document.createElement('div');
    addCommentSection.classList.add('addComments');

    const input = document.createElement('input');
    input.setAttribute('value', text);
    input.readOnly = true;

    const buttons = document.createElement('div');
    buttons.classList.add('buttons');
    buttons.insertAdjacentHTML('beforeend', '<button class=saveComment onclick=editComment(event)>Save</button>');
    buttons.insertAdjacentHTML('beforeend', '<button class=closeComment onclick=closeEditor(event)>x</button>');


    const anchors = document.createElement('div');
    anchors.classList.add('anchors');
    anchors.insertAdjacentHTML('beforeend', '<a href=# onclick=openCommentBlock(event) class=editComment>Edit</a>');
    anchors.insertAdjacentHTML('beforeend', '<a href=# onclick=deleteComment(event) class=deleteComment>delete</a>');

    addCommentSection.insertAdjacentHTML('beforeend', `<h4>${fullName}</h4>`);
    addCommentSection.insertAdjacentElement('beforeend', input);
    addCommentSection.insertAdjacentElement('beforeend', buttons);
    addCommentSection.insertAdjacentElement('beforeend', anchors);


    comment.insertAdjacentElement('beforeend', avatar);
    comment.insertAdjacentElement('beforeend', addCommentSection);

    // console.log(comment);
    return comment;
}

function renderModal({
    id,
    title,
    description,
    commentInfo
}) {
    $modal.id = id;
    const modalHeading = document.createElement('div');
    modalHeading.classList.add('modalHeading');
    modalHeading.setAttribute('onclick', 'handle(event)');
    modalHeading.setAttribute('onkeypress', `saveModalTitle(event)`);

    const input = document.createElement('input');
    input.setAttribute('value', title);

    modalHeading.insertAdjacentElement('beforeend', input);
    modalHeading.insertAdjacentHTML('beforeend', `<button id="close" onclick=hideModal()>x</button>`);

    $modal.innerHTML = ``;
    $modal.insertAdjacentElement('beforeend', modalHeading);
    $modal.insertAdjacentHTML('beforeend', ` <div class="description">
                                        <h3 style="display:inline">Description</h3> ${description&&'<button class="editDescription" onclick=editDescription(event) style=width:40px;height:30px;color:black;font-family:inherit;cursor:pointer;border:none;outline:none>Edit</button>'}
                                        ${description?("<p style=margin-top:20px>"+description+"</p><textarea placeholder='Add a more detailed description...' onclick='addDescription(event)' style=display:none></textarea>")
                                        :("<p style=margin-top:20px style=display:none>"+description+"</p><textarea placeholder='Add a more detailed description...' onclick='addDescription(event)'></textarea>")}
                                        <div class="buttons">
                                            <button id="save" onclick="saveDescription(event)">Save</button>
                                            <button id="close" onclick="closeDescription(event)">x</button>
                                        </div>
                                        </div>`);
    $modal.insertAdjacentHTML('beforeend', ` <div class="activity">
                                                <h3>Activity</h3>
                                                <div class="commentBox">
                                                    <textarea placeholder="Write a comment..." onclick=handleComment(event) onkeyup='changeButtonColor(event)'></textarea>
                                                    <button id="save" class="toggleStyle" onclick=addComment(event)>Save</button>
                                                </div>
                                            </div>`);

    const commentSection = document.createElement('ul');
    commentSection.classList.add('commentSection');

    for (let i = 0; i < commentInfo.length; i++) {
        commentSection.insertAdjacentElement('beforeend', singleComment(commentInfo[i]));
    }
    $modal.insertAdjacentElement('beforeend', commentSection);

}
async function handleCurrentCard(e) {
    const cardContainer = e.target.parentElement;
    const cardId = cardContainer.id;
    const card = await fetchSingleCard(cardId);
    const actions = await fetchActionsOfACard(cardId);
    const commentInfo = getCommentInfo(actions);
    renderModal({
        id: card.id,
        title: card.name,
        description: card.desc,
        commentInfo
    });
}

function editCardTitle(e) {
    e.previousElementSibling.readOnly = false;
    e.previousElementSibling.focus();
    e.nextElementSibling.style.display = 'block';
}

function editListName(e) {
    if (e.keyCode !== 13) return;

    //getting the parent list element
    const list = e.target.parentElement.parentElement;
    const listId = list.id;
    const value = e.target.value;
    e.target.readOnly = true;
    e.target.style.backgroundColor = 'inherit';
    const options = {
        method: 'PUT',
        body: JSON.stringify({
            name: value
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        }
    }
    fetch(`https://api.trello.com/1/lists/${listId}?key=92bca003422f39393b116d6837389c0a&token=d2eeb8439feca80f5784d731fb5dd6bc621d6c31bb702dd6104e57b11d8a696c`, options).then(res => res.json()).then(data => renderUI()).catch(err => console.log(err.message));

}
async function createNewCard(listId, value1, value2) {
    const body = {
        name: value1,
        desc: value2
    }
    const options = {
        method: "POST",
        body: JSON.stringify(value2 === undefined ? {
            name: value1
        } : body),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }
    const response = await fetch(`https://api.trello.com/1/cards?idList=${listId}&key=92bca003422f39393b116d6837389c0a&token=d2eeb8439feca80f5784d731fb5dd6bc621d6c31bb702dd6104e57b11d8a696c`, options);
    return await response.json();
}

function saveCardTitle(e) {
    //taking current value of input element.
    const value = e.previousElementSibling.previousElementSibling.value;
    if (!value) return;

    //id the card
    const id = e.parentElement.id;
    const body = {
        name: value
    }
    changeCardData(id, body).then(response => response.json()).then(text => renderUI()).catch(err => console.error(err.message));
}

function addNewCard(e) {
    e.preventDefault();
    if (e.target.className === 'addCard') {
        e.target.previousElementSibling.style.display = 'block';
        e.target.style.display = 'none';
    } else if (e.target.id === 'add') {
        const textArea = e.target.parentElement.previousElementSibling;
        const value = textArea.value;

        if (!value) return;

        createNewCard(e.target.parentElement.parentElement.parentElement.id, value);

    } else if (e.target.id === 'cancel') {
        e.target.parentElement.parentElement.style.display = "none";
        e.target.parentElement.parentElement.nextElementSibling.style.display = 'block';
    } else {
        return;
    }
}
let elementId;

function getSingleCard(value, cardId, pos) {
    const li = document.createElement('li');

    li.draggable = true;

    li.addEventListener('dragstart', function (e) {
        elementId = this.id;
    });
    li.addEventListener('dragover', function (e) {
        e.preventDefault();
    });
    li.addEventListener('drop', async function (e) {
        e.preventDefault();
        const listId = this.parentElement.parentElement.id;
        const closestCardId = this.closest('li').id;
        // const list=await getCardsOnAList(listId);
        const card = await fetchSingleCard(elementId);
        const newCard = await createNewCard(listId, card.name, card.desc);

        const actions = await fetchActionsOfACard(elementId);
        const commentInfo = getCommentInfo(actions);

        for (let index = 0; index < commentInfo.length; index++) {
            await addCommentApi(newCard.id, commentInfo[index].text);
        }
        const response = await fetch(`https://api.trello.com/1/cards/${elementId}?key=92bca003422f39393b116d6837389c0a&token=d2eeb8439feca80f5784d731fb5dd6bc621d6c31bb702dd6104e57b11d8a696c`, {
            method: 'DELETE'
        });
        await response.json();
        renderUI(listId, closestCardId, newCard.id);
        // console.log(this.closest('li'), endId);

    });

    li.setAttribute('id', cardId);
    li.setAttribute('data-pos', pos)
    li.classList.add('card');
    li.setAttribute('onmouseover', 'handlehover(this)');
    li.setAttribute('onmouseout', 'handleOut(this)');
    const input = document.createElement('input');
    input.setAttribute('value', value);
    input.readOnly = true;
    li.insertAdjacentElement('beforeend', input);
    li.insertAdjacentHTML('beforeend', `<i class="fa-solid fa-pen-to-square" id="toggle" onclick=editCardTitle(this)></i>`);
    li.insertAdjacentHTML('beforeend', `<button id="save" onclick='saveCardTitle(this)'>save</button>`)
    return li;
}

function openNewListForm(e) {
    const form = e.target.nextElementSibling;
    const currentElement = e.target;
    currentElement.style.display = 'none';
    form.style.display = 'block';
}

async function addNewList(e) {
    const {
        id
    } = await fetchABoard();
    const value = e.target.parentElement.previousElementSibling.value;
    createANewList(id, value).then(() => renderUI());
}

function closeNewListForm(e) {
    const form = e.target.parentElement.parentElement;
    const addNewListBtn = e.target.parentElement.parentElement.previousElementSibling;
    form.style.display = 'none';
    addNewListBtn.style.display = 'block';
}

function newListTemplate() {
    //addnewlist dynamically
    const newList = document.createElement('div');
    newList.classList.add('newList');

    const addNewList = document.createElement('button');
    addNewList.classList.add('addNewList');
    addNewList.setAttribute('onclick', 'openNewListForm(event)')
    addNewList.innerText = 'Add another list';

    const form = document.createElement('form');
    const textArea = document.createElement('textarea');

    const buttons = document.createElement('div');
    buttons.classList.add('buttons');

    const addBtn = document.createElement('button');
    addBtn.classList.add('add');
    addBtn.setAttribute('onclick', 'addNewList(event)');
    addBtn.innerText = 'Add list'

    const closeBtn = document.createElement('button');
    closeBtn.classList.add('close');
    closeBtn.setAttribute('onclick', 'closeNewListForm(event)');
    closeBtn.innerText = 'x'

    buttons.insertAdjacentElement('beforeend', addBtn);
    buttons.insertAdjacentElement('beforeend', closeBtn);

    form.insertAdjacentElement('beforeend', textArea);
    form.insertAdjacentElement('beforeend', buttons);

    newList.insertAdjacentElement('beforeend', addNewList);
    newList.insertAdjacentElement('beforeend', form);
    return newList;
}
async function renderUI(listId, closestCardId, newCardId) {

    const lists = await fetchLists();
    const cards = await fetchCards();
    // console.log(cards);
    let cardIdWithName = {}
    for (let i = 0; i < lists.length; i++) {
        cardIdWithName[lists[i].id] = lists[i].name;
    }
    let saperateCards = {};
    for (let i = 0; i < cards.length; i++) {
        if (!saperateCards[cardIdWithName[cards[i].idList]])
            saperateCards[cardIdWithName[cards[i].idList]] = [];

        saperateCards[cardIdWithName[cards[i].idList]].push({
            id: cards[i].id,
            title: cards[i].name,
            description: cards[i].desc,
            pos: cards[i].pos
        });
    }

    if (listId && closestCardId && newCardId) {
        const listName = cardIdWithName[listId];
        const temproryCards = saperateCards[listName];
        let index = temproryCards.length - 2;
        while (index > 0 && temproryCards[index].id != closestCardId) {
            const firstCard = temproryCards[index + 1];
            temproryCards[index + 1] = temproryCards[index];
            temproryCards[index] = firstCard;
            index--;
        }
        saperateCards[listName] = temproryCards;
    }
    //for empty cards with only heading
    for (const key in cardIdWithName) {
        if (!saperateCards[cardIdWithName[key]])
            saperateCards[cardIdWithName[key]] = [];
    }
    $listContainer.innerHTML = ``;
    for (const key in saperateCards) {
        const ul = document.createElement('ul');
        ul.classList.add('cards');
        for (let i = 0; i < saperateCards[key].length; i++) {
            const li = getSingleCard(saperateCards[key][i].title, saperateCards[key][i].id, saperateCards[key][i].pos);
            ul.insertAdjacentElement('beforeend', li);
        }
        const div = document.createElement('div');
        div.classList.add('list');

        //setUnique Id to list
        for (const elem in cardIdWithName) {
            if (cardIdWithName[elem] === key) {
                div.setAttribute('id', elem);
                break;
            }
        }
        // *************
        const input = document.createElement('input');
        input.setAttribute('value', key);
        input.setAttribute('onkeypress', 'editListName(event)');
        input.readOnly = true;

        const cardHeader = document.createElement('div');
        cardHeader.classList.add('cardHeading');
        cardHeader.insertAdjacentElement('beforeend', input);
        cardHeader.insertAdjacentHTML('beforeend', '<i class="fa-solid fa-trash-can" id="options"></i>');


        div.insertAdjacentElement('beforeend', cardHeader);
        div.insertAdjacentElement('beforeend', ul);
        div.insertAdjacentHTML('beforeend', `   <form action="" class="newCardTitle">
        <textarea placeholder="Enter a title for this card..."></textarea>
        <div class="buttonContainer">
       <button id="add">Add card</button>
       <button id="cancel">X</button>
        </div>
        </form>`)
        div.insertAdjacentHTML('beforeend', `<button class="addCard"><span>+</span> Add a card</button>`)
        $listContainer.insertAdjacentElement('beforeend', div);
    }

    $listContainer.insertAdjacentElement('beforeend', newListTemplate());
}

renderUI();