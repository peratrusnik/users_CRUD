//views
let accountsView = document.querySelector('#accounts-view');
let addAccountsView = document.querySelector('#add-accounts-view');
let editDeleteView = document.querySelector('#edit-delete-view');
let editAccountView = document.querySelector('#edit-account-view');
let allViews = [accountsView, addAccountsView, editDeleteView, editAccountView];
//inputs
let idInput = addAccountsView.querySelector('input[name="id"]');
let fullNameInput = addAccountsView.querySelector('input[name="fullName"]');
let emailInput = addAccountsView.querySelector('input[name="email"]');
let phoneInput = addAccountsView.querySelector('input[name="phone"]');
let cityInput = addAccountsView.querySelector('input[name="city"]');
// edit account view input
let editIdInput = editAccountView.querySelector('input[name="id"]');
let editFullNameInput = editAccountView.querySelector('input[name="fullName"]');
let editEmailInput = editAccountView.querySelector('input[name="email"]');
let editPhoneInput = editAccountView.querySelector('input[name="phone"]');
let editCityInput = editAccountView.querySelector('input[name="city"]');
//btns
let saveBtn = document.querySelector('#saveBtn');
let editBtn = document.querySelector('#editBtn');
// tbody
let accountsTbody = accountsView.querySelector('tbody');
let editDeleteTbody = editDeleteView.querySelector('tbody');
//links
let links = document.querySelectorAll('.links');
//listener
links.forEach(link => link.addEventListener('click', displayView));
saveBtn.addEventListener('click', saveNewAccount);
editBtn.addEventListener('click', editAccount);


function editAccount() {
    let newValues = {
        id: editIdInput.value,
        fullName: editFullNameInput.value,
        email: editEmailInput.value,
        phone: editPhoneInput.value,
        city: editCityInput.value
    } 
    let index = database.findIndex(e => e.id === editBtn.getAttribute('data-id'));
    database[index] = newValues;
    createTable();
    displayView('accounts-view');
}



function displayView(e) {
    let view = e; // account-view, edit-delete-view, edit-account-view
    if (e.type === 'click') {
        e.preventDefault();
        view = this.getAttribute('href');
    }
    allViews.forEach(v => v.style.display = 'none');
    links.forEach(link => link.classList.remove('active'));
    try {
        document.querySelector(`a[href='${view}']`).classList.add('active');        
    } catch (e) {
        document.querySelector(`a[href='edit-delete-view']`).classList.add('active');         
    }
    document.querySelector(`#${view}`).style.display = 'block';
    if (view === 'edit-delete-view') {
        createTable(editDeleteTbody);
    }
}

function saveNewAccount() {
    let userData = {
            id: idInput.value,
            fullName: fullNameInput.value,
            email: emailInput.value,
            phone: phoneInput.value,
            city: cityInput.value
    }
    database.push(userData);
    createTable();
    clearInputs(idInput, fullNameInput, emailInput, phoneInput, cityInput);
    displayView('accounts-view');
}

function clearInputs() {
    for (let i = 0; i < arguments.length; i++) {
        const input = arguments[i];
        input.value = '';
    }
}

// createTable
createTable();  //main table

function createTable(body) {
    let addOn = '';
    if (body) {
        addOn += `
            <td>
                <button class='btn btn-sm btn-warning editBtn' data-id='{{id}}'>Edit</button>
                <button class='btn btn-sm btn-danger deleteBtn' data-id='{{id}}'>Delete</button>
            </td>
        `.trim()
    }
    let text = ``;
    database.forEach((user, index) => {
        text += `
            <tr>
                <td>${user.id}</td>
                <td>${user.fullName}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${user.city}</td>
                ${(addOn) ? addOn.replace('{{id}}', user.id).replace('{{id}}', user.id)  : '' }
            </tr>
        `.trim()
    });
    (addOn) ? editDeleteTbody.innerHTML = text : accountsTbody.innerHTML = text;
    if (addOn) {
        let allDeleteBtns = document.querySelectorAll('.deleteBtn');
        let allEditBtns = document.querySelectorAll('.editBtn');
        allDeleteBtns.forEach((btn, index) => {
            btn.addEventListener('click', deleteAccount);
            allEditBtns[index].addEventListener('click', showEditForm);
        })
    }
}

function showEditForm() {
    //add data to form before showing
    let id = this.getAttribute('data-id');
    editBtn.setAttribute('data-id', id);
    let currentUser = database.find(e => e.id === id);
    editIdInput.value = currentUser.id;
    editFullNameInput.value = currentUser.fullName;
    editEmailInput.value = currentUser.email;
    editPhoneInput.value = currentUser.phone;
    editCityInput.value = currentUser.city;

    displayView('edit-account-view');
}

function deleteAccount() {
    let id = this.getAttribute('data-id');
    database = database.filter(el => el.id !== id);
    createTable();
    displayView('accounts-view');
}