window.onload = function () {

    loadTasks();
    updateStats();
    updateProgress();
    checkEmpty();

    if(localStorage.getItem("theme")==="dark"){

        document.body.classList.add("dark-mode");

        document.getElementById("themeBtn")
        .innerText="☀️ Light Mode";
    }
};

function addTask() {

    const input = document.getElementById("taskInput");
    const priority = document.getElementById("priority").value;
    const dueDate = document.getElementById("dueDate").value;
    const category = document.getElementById("category").value;

    if (input.value.trim() === "") {
        alert("Please enter a task");
        return;
    }

    const li = document.createElement("li");

    li.innerHTML = `
        <div>

            <span class="task-text">
                ${input.value}
            </span>

            <span class="priority ${priority.toLowerCase()}">
                ${priority}
            </span>

            <div class="category">
                ${category}
            </div>

            <div class="priority-date">
                📅 ${dueDate || "No Due Date"}
            </div>

        </div>

        <div class="task-buttons">
            <button onclick="completeTask(this)">✓</button>
            <button onclick="editTask(this)">✏ Edit</button>
            <button onclick="deleteTask(this)">🗑 Delete</button>
        </div>
    `;

    document.getElementById("taskList").appendChild(li);

    input.value = "";
    document.getElementById("dueDate").value = "";

    saveTasks();
    updateStats();
    updateProgress();
    checkEmpty();
}

function completeTask(btn) {

    btn.parentElement
        .parentElement
        .querySelector(".task-text")
        .classList.toggle("completed");

    // Completion Time
    const li = btn.closest("li");

    if (!li.querySelector(".completed-time")) {

        const completedTime = document.createElement("div");

        completedTime.className = "completed-time";

        completedTime.innerHTML =
            "✅ Completed: " + new Date().toLocaleString();

        li.appendChild(completedTime);
    }

    saveTasks();
    updateStats();
    updateProgress();
}



function deleteTask(btn) {

    btn.parentElement
        .parentElement
        .remove();

    saveTasks();
    updateStats();
    updateProgress();
    checkEmpty();
}

function saveTasks() {

    localStorage.setItem(
        "tasks",
        document.getElementById("taskList").innerHTML
    );
}

function loadTasks() {

    document.getElementById("taskList").innerHTML =
        localStorage.getItem("tasks") || "";

    updateStats();
    updateProgress();
    checkEmpty();
}
function updateStats() {

    const tasks =
        document.querySelectorAll("#taskList li");

    const completed =
        document.querySelectorAll(".completed");

    const pending =
        tasks.length - completed.length;

    let percentage = 0;

    if(tasks.length > 0){
        percentage = Math.round(
            (completed.length / tasks.length) * 100
        );
    }

    document.getElementById("total").innerText =
        tasks.length;

    document.getElementById("completed").innerText =
        completed.length;

    document.getElementById("pending").innerText =
        pending;

    document.getElementById("percentage").innerText =
        percentage + "%";
}

function updateProgress() {

    const total =
        document.querySelectorAll("#taskList li").length;

    const completed =
        document.querySelectorAll(".completed").length;

    let percentage = 0;

    if (total > 0) {
        percentage =
            Math.round((completed / total) * 100);
    }

    document.getElementById("progressFill")
        .style.width = percentage + "%";

    document.getElementById("progressPercent")
        .innerText = percentage + "%";
}
function searchTasks(){

    const search =
        document.getElementById("searchTask")
        .value
        .toLowerCase();

    const tasks =
        document.querySelectorAll("#taskList li");

    tasks.forEach(task => {

        const text =
            task.innerText.toLowerCase();

        if(text.includes(search)){
            task.style.display = "flex";
        }else{
            task.style.display = "none";
        }

    });
}
function toggleTheme(){

    document.body.classList.toggle("dark-mode");

    const btn =
        document.getElementById("themeBtn");

    if(
        document.body.classList.contains("dark-mode")
    ){
        btn.innerText = "☀️ Light Mode";
        localStorage.setItem("theme","dark");
    }
    else{
        btn.innerText = "🌙 Dark Mode";
        localStorage.setItem("theme","light");
    }
}
function filterTasks(priority){

    const tasks =
        document.querySelectorAll("#taskList li");

    tasks.forEach(task => {

        if(priority === "all"){
            task.style.display = "flex";
            return;
        }

        const badge =
            task.querySelector(".priority");

        if(
            badge &&
            badge.classList.contains(priority)
        ){
            task.style.display = "flex";
        }
        else{
            task.style.display = "none";
        }

    });
}
function checkEmpty(){

    const tasks =
        document.querySelectorAll("#taskList li");

    if(tasks.length === 0){
        document.getElementById("emptyMessage").style.display = "block";
    }
    else{
        document.getElementById("emptyMessage").style.display = "none";
    }
}
function clearAllTasks(){

    if(confirm("Are you sure you want to delete all tasks?")){

        document.getElementById("taskList").innerHTML = "";

        saveTasks();
        updateStats();
        updateProgress();
        checkEmpty();
    }
}

function editTask(button) {

    const task = button.closest("li");

    const taskText = task.querySelector(".task-text");

    const newTask = prompt("Edit Task", taskText.textContent);

    if (newTask !== null && newTask.trim() !== "") {
        taskText.textContent = newTask.trim();

        saveTasks();
        updateStats();
        updateProgress();
    }
}
