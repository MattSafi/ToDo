document.addEventListener("DOMContentLoaded", () => {
  renderTasks();
  document.getElementById("add-task-btn").addEventListener("click", addTask);
  document
    .querySelector(".task-input")
    .addEventListener("keydown", function (event) {
      // Check if Enter was pressed
      if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("add-task-btn").click();
      }
    });
});

function addTask() {
  const taskInput = document.querySelector(".task-input");
  const task = taskInput.value.trim();
  if (task) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    taskInput.value = "";
    renderTasks();
  }
}

function renderTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const tasksList = document.querySelector(".tasks-list");
  tasksList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.setAttribute("draggable", "true");
    li.setAttribute("data-index", index);
    li.innerHTML = `
      ${task} 
      <button class="delete-btn" data-index="${index}">Delete</button>
    `;
    tasksList.appendChild(li);

    li.addEventListener("dragstart", handleDragStart);
    li.addEventListener("dragover", handleDragOver);
    li.addEventListener("drop", handleDrop);
    li.addEventListener("dragend", handleDragEnd);
  });

  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", function () {
      deleteTask(this.getAttribute("data-index"));
    });
  });
}

function deleteTask(index) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

let draggedItem = null;

function handleDragStart(event) {
  draggedItem = this;
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/html", this.innerHTML);
}

function handleDragOver(event) {
  if (event.preventDefault) {
    event.preventDefault();
  }
  event.dataTransfer.dropEffect = "move";
  return false;
}

function handleDrop(event) {
  if (event.stopPropagation) {
    event.stopPropagation();
  }

  if (draggedItem !== this) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const draggedIndex = draggedItem.getAttribute("data-index");
    const targetIndex = this.getAttribute("data-index");

    tasks.splice(targetIndex, 0, tasks.splice(draggedIndex, 1)[0]);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
  }
  return false;
}

function handleDragEnd(event) {
  draggedItem = null;
}
