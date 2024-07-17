let tasks = [];
const itemsPerPage = 5;
let currentPage = 1;

document.getElementById('addTaskBtn').addEventListener('click', addTask);
document.getElementById('taskInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') addTask();
});
document.getElementById('searchInput').addEventListener('input', renderTasks);
document.getElementById('filterSelect').addEventListener('change', renderTasks);
document.getElementById('prevPageBtn').addEventListener('click', () => changePage(-1));
document.getElementById('nextPageBtn').addEventListener('click', () => changePage(1));

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        alert('Please enter a task.');
        return;
    }

    tasks.push({ text: taskText, completed: false });
    taskInput.value = '';
    renderTasks();
}

function toggleTaskCompletion(event) {
    const listItem = event.target.parentElement;
    const index = listItem.getAttribute('data-index');
    tasks[index].completed = event.target.checked;
    renderTasks();
}

function editTask(event) {
    const listItem = event.target.parentElement;
    const index = listItem.getAttribute('data-index');
    const span = listItem.querySelector('span');
    const editBtn = listItem.querySelector('.editBtn');
    const saveBtn = listItem.querySelector('.saveBtn');

    span.contentEditable = true;
    span.focus();
    editBtn.style.display = 'none';
    saveBtn.style.display = 'inline-block';
}

function saveTask(event) {
    const listItem = event.target.parentElement;
    const index = listItem.getAttribute('data-index');
    const span = listItem.querySelector('span');
    const editBtn = listItem.querySelector('.editBtn');
    const saveBtn = listItem.querySelector('.saveBtn');

    tasks[index].text = span.innerText;
    span.contentEditable = false;
    editBtn.style.display = 'inline-block';
    saveBtn.style.display = 'none';
    renderTasks();
}

function deleteTask(event) {
    const listItem = event.target.parentElement;
    const index = listItem.getAttribute('data-index');
    tasks.splice(index, 1);
    renderTasks();
}

function changePage(direction) {
    currentPage += direction;
    renderTasks();
}

function renderTasks() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const filterSelect = document.getElementById('filterSelect').value;
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    let filteredTasks = tasks.filter(task => {
        const matchesSearch = task.text.toLowerCase().includes(searchInput);
        const matchesFilter = (filterSelect === 'all') ||
                              (filterSelect === 'completed' && task.completed) ||
                              (filterSelect === 'pending' && !task.completed);
        return matchesSearch && matchesFilter;
    });

    const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

    paginatedTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.setAttribute('data-index', tasks.indexOf(task));

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', toggleTaskCompletion);

        const span = document.createElement('span');
        span.innerText = task.text;

        const editBtn = document.createElement('button');
        editBtn.innerText = 'Edit';
        editBtn.className = 'editBtn';
        editBtn.addEventListener('click', editTask);

        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = 'Delete';
        deleteBtn.className = 'deleteBtn';
        deleteBtn.addEventListener('click', deleteTask);

        const saveBtn = document.createElement('button');
        saveBtn.innerText = 'Save';
        saveBtn.className = 'saveBtn';
        saveBtn.style.display = 'none';
        saveBtn.addEventListener('click', saveTask);

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(editBtn);
        li.appendChild(saveBtn);
        li.appendChild(deleteBtn);

        if (task.completed) {
            li.classList.add('completed');
            editBtn.style.display = 'none';
        }

        taskList.appendChild(li);
    });

    document.getElementById('filterContainer').style.display = tasks.length > 0 ? 'flex' : 'none';
    document.getElementById('paginationContainer').style.display = tasks.length > itemsPerPage ? 'flex' : 'none';
    document.getElementById('pageInfo').innerText = `Page ${currentPage} of ${totalPages}`;
}
