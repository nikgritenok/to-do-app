import "./scss/main.scss";
import {
  generateId,
  getTasks,
  addTask,
  deleteTask as removeTask,
  updateTask,
} from "./components/localStorage";

const root = document.getElementById("root");
document.title = "to-do-app";

function MainPage() {
  // Render tasks and input area
  const render = () => {
    root.innerHTML = "";
    root.appendChild(TaskInput());

    const tasks = getTasks();
    if (tasks.length > 0) {
      tasks.forEach((task) => root.appendChild(createTaskElement(task)));
    } else {
      root.appendChild(createNoTasksMessage());
    }
  };

  // Input handling
  const TaskInput = () => {
    const container = document.createElement("div");
    container.classList.add("task-input-container");
    container.innerHTML = `
      <div class="input-container">
          <input placeholder="Title..." class="title-input">
          <input placeholder="About..." class="about-input">
      </div>
      <button class="add-button">+</button>`;

    setupListeners(container);
    return container;
  };

  const setupListeners = (element) => {
    const titleInput = element.querySelector(".title-input");
    const aboutInput = element.querySelector(".about-input");
    const addButton = element.querySelector(".add-button");

    addButton.addEventListener("click", () => AddTask(titleInput, aboutInput));
  };

  const AddTask = (titleInput, aboutInput) => {
    const title = titleInput.value.trim();
    const about = aboutInput.value.trim();

    if (title && about) {
      const task = { id: generateId(), title, about };
      addTask(task);
      titleInput.value = "";
      aboutInput.value = "";
      render();
    } else {
      alert("Поля не должны быть пустыми.");
    }
  };

  // Task creation and display
  const createNoTasksMessage = () => {
    const noTasksMessage = document.createElement("div");
    noTasksMessage.classList.add("main-container");
    noTasksMessage.innerHTML = `<div class="text-main-container"><span>No tasks</span></div>`;
    return noTasksMessage;
  };

  const createTaskElement = (task) => {
    const taskContainer = document.createElement("div");
    taskContainer.classList.add("task-element");

    taskContainer.innerHTML = `
      <div class="task-container">
          <div class="task-container-text">
              <h3>${task.title}</h3>
              <p>${task.about}</p>
          </div>
          <button class="delete-button" id="deleteButton-${task.id}">x</button>
      </div>
      <div class="edit-menu" id="editMenu-${task.id}" style="display: none;">
          <div class="block-buttons">
              <button class="block-buttons__button block-buttons__button--share"><img src="../static/icons/Share.svg" alt="share"></button>
              <button class="block-buttons__button block-buttons__button--info" alt="info">i</button>
              <button class="block-buttons__button block-buttons__button--edit"><img src="../static/icons/Edit.svg" alt="edit"></button>
          </div>
      </div>`;

    setupTaskListeners(taskContainer, task.id);
    return taskContainer;
  };

  // Task event handling
  const setupTaskListeners = (taskContainer, taskId) => {
    const deleteButton = taskContainer.querySelector(`.delete-button`);
    deleteButton.addEventListener("click", (event) => {
      event.stopPropagation();
      deleteTask(taskId);
    });

    const editMenu = taskContainer.querySelector(`#editMenu-${taskId}`);
    taskContainer.addEventListener("click", (event) => {
      event.stopPropagation();
      editMenu.style.display =
        editMenu.style.display === "flex" ? "none" : "flex";
    });

    const buttonShare = editMenu.querySelector(".block-buttons__button--share");
    const buttonEdit = editMenu.querySelector(".block-buttons__button--edit");

    buttonShare.addEventListener("click", Share);
    buttonEdit.addEventListener("click", () => Edit(taskId));
  };

  const deleteTask = (taskId) => {
    const confirmationDialog = createConfirmationDialog();
    root.appendChild(confirmationDialog);
    setupConfirmationListeners(confirmationDialog, taskId);
  };

  const createConfirmationDialog = () => {
    const confirmationDialog = document.createElement("div");
    confirmationDialog.classList.add("delete-container");
    confirmationDialog.innerHTML = `
      <div class="delete-container-content">
          <span>Delete this task?</span>
          <div class="delete-buttons">
              <button class="yes-button">Yes</button>
              <button class="no-button">No</button>
          </div>
      </div>`;
    return confirmationDialog;
  };

  const setupConfirmationListeners = (confirmationDialog, taskId) => {
    const yesButton = confirmationDialog.querySelector(".yes-button");
    const noButton = confirmationDialog.querySelector(".no-button");

    yesButton.addEventListener("click", () => {
      removeTask(taskId); // Удаляем задачу из localStorage
      render();
      root.removeChild(confirmationDialog);
    });

    noButton.addEventListener("click", () => {
      root.removeChild(confirmationDialog);
    });
  };

  // Share and Edit handling
  const Share = () => {
    const shareContainer = createShareContainer();
    root.appendChild(shareContainer);
    setupShareListeners(shareContainer);
  };

  const createShareContainer = () => {
    const shareContainer = document.createElement("div");
    shareContainer.classList.add("share-container");
    shareContainer.innerHTML = `
      <div class="share-container-content">
          <div class="share-buttons">
              <button class="share-button"><img src="../static/icons/Share.svg" alt="Share"></button>
              <button class="vk-button"><img src="../static/icons/VK.svg" alt="VK"></button>
              <button class="telegram-button"><img src="../static/icons/Telegram.svg" alt="Telegram"></button>
              <button class="whatsapp-button"><img src="../static/icons/Whatsapp.svg" alt="Whatsapp"></button>
              <button class="facebook-button"><img src="../static/icons/Facebook.svg" alt="Facebook"></button>
          </div>
      </div>`;
    return shareContainer;
  };

  const setupShareListeners = (shareContainer) => {
    document.addEventListener("click", (event) => {
      const content = shareContainer.querySelector(".share-container-content");
      if (!content.contains(event.target)) {
        shareContainer.remove();
      }
    });
  };

  const Edit = (taskId) => {
    const editContainer = createEditContainer(taskId);
    root.appendChild(editContainer);
    setupEditListeners(editContainer, taskId);
  };

  const createEditContainer = (taskId) => {
    const task = getTasks().find((task) => task.id === taskId);
    const editContainer = document.createElement("div");
    editContainer.classList.add("edit-container");
    editContainer.innerHTML = `
      <div class="edit-container-content">
          <div class="edit-window">
              <input type="text" placeholder="Mini Input..." class="edit-title" value="${task.title}">                    
              <input type="text" placeholder="Max Input..." class="edit-about" value="${task.about}">
              <div class="buttons">
                  <button class="cancel">Cancel</button>
                  <button class="save">Save</button>
              </div>
          </div>
      </div>`;
    return editContainer;
  };

  const setupEditListeners = (editContainer, taskId) => {
    const cancelButton = editContainer.querySelector(".cancel");
    const saveButton = editContainer.querySelector(".save");

    saveButton.addEventListener("click", () => {
      const updatedTask = {
        id: taskId,
        title: editContainer.querySelector(".edit-title").value,
        about: editContainer.querySelector(".edit-about").value,
      };
      updateTask(updatedTask);
      root.removeChild(editContainer);
      render();
    });

    cancelButton.addEventListener("click", () => {
      root.removeChild(editContainer);
    });
  };

  render();
}

MainPage();
