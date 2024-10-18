let root = document.getElementById("root");

function MainPage() {
  let hasTasks = false;
  let tasks = [];

  function TaskInput() {
    const container = document.createElement("div");
    container.className = "task-input-container";
    container.innerHTML = `
            <div class="input-container">
                <input placeholder="Title..." class="title-input">
                <input placeholder="About..." class="about-input">
            </div>
            <button class="add-button">+</button>`;
    return container;
  }

  function _setupListeners(element) {
    let titleInput = element.querySelector(".title-input");
    let aboutInput = element.querySelector(".about-input");
    let addButton = element.querySelector(".add-button");
    addButton.addEventListener("click", () => AddTask(titleInput, aboutInput));
  }

  function AddTask(titleInput, aboutInput) {
    const title = titleInput.value.trim();
    const about = aboutInput.value.trim();
    if (title && about) {
      const newTask = { title, about };
      tasks.push(newTask);
      hasTasks = true;
      titleInput.value = "";
      aboutInput.value = "";
      render();
    } else {
      alert("Поля не должны быть пустыми.");
    }
  }

  function render() {
    root.innerHTML = "";
    root.appendChild(TaskInput());
    _setupListeners(root);

    if (hasTasks) {
      tasks.forEach((task, index) => {
        const taskElement = createTaskElement(task, index);
        root.appendChild(taskElement);
      });
    } else {
      const noTasksMessage = document.createElement("div");
      noTasksMessage.className = "main-container";
      noTasksMessage.innerHTML = `<div class="text-main-container"><span>No tasks</span></div>`;
      root.appendChild(noTasksMessage);
    }
  }

  function createTaskElement(task, index) {
    const taskElement = document.createElement("div");
    taskElement.className = "task-element";
    const taskContainer = document.createElement("button");
    taskContainer.className = "task-container";
    taskContainer.innerHTML = `
            <div class="task-container-text">
                <h3>${task.title}</h3>
                <p>${task.about}</p>
            </div>
            <button class="delete-button" id="deleteButton-${index}">x</button>`;
    const deleteButton = taskContainer.querySelector(`#deleteButton-${index}`);
    deleteButton.addEventListener("click", () => deleteTask(index));

    const editMenu = document.createElement("div");
    editMenu.className = "edit-menu";
    editMenu.id = `editMenu-${index}`;
    editMenu.style.display = "none";
    editMenu.innerHTML = `
            <div class="block-buttons">
                <button class="block-buttons__button block-buttons__button--share"><img src="../static/icons/Share.svg" alt="share"></button>
                <button class="block-buttons__button block-buttons__button--info" alt="info">i</button>
                <button class="block-buttons__button block-buttons__button--edit"><img src="../static/icons/Edit.svg" alt="edit"></button>
            </div>`;

    const buttonShare = editMenu.querySelector(".block-buttons__button--share");
    const buttonEdit = editMenu.querySelector(".block-buttons__button--edit");

    buttonShare.addEventListener("click", () => Share());
    buttonEdit.addEventListener("click", () => Edit(index));

    taskElement.appendChild(taskContainer);
    taskElement.appendChild(editMenu);

    taskContainer.addEventListener("click", (event) => {
      event.stopPropagation();
      const isEditMenuVisible = editMenu.style.display === "flex";
      editMenu.style.display = isEditMenuVisible ? "none" : "flex";
    });
    return taskElement;
  }

  function Share() {
    const shareContainer = document.createElement("div");
    shareContainer.className = "share-container";
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
    root.appendChild(shareContainer);

    document.addEventListener("click", (event) => {
      const isClickInside = shareContainer.contains(event.target);
      if (isClickInside) {
        root.removeChild(shareContainer);
        document.removeEventListener("click", arguments.callee);
      }
    });
  }

  function Edit(index) {
    const editContainer = document.createElement("div");
    editContainer.className = "edit-container";
    editContainer.innerHTML = `
            <div class="edit-container-content">
                <div class="edit-window">
                    <input type="text" placeholder="Mini Input..." class="edit-title" >                    
                    <input type="text" placeholder="Max Input..." class="edit-about" >
                    <div class="buttons">
                        <button class="cancel">Cancel</button>
                        <button class="save">Save</button>
                    </div>
                </div>
            </div>`;

    root.appendChild(editContainer);

    const cancelButton = editContainer.querySelector(".cancel");
    const saveButton = editContainer.querySelector(".save");

    saveButton.addEventListener("click", () => {
      tasks[index].title = editContainer.querySelector(".edit-title").value;
      tasks[index].about = editContainer.querySelector(".edit-about").value;
      root.removeChild(editContainer);
      render();
    });

    cancelButton.addEventListener("click", () => {
      root.removeChild(editContainer);
    });
  }

  function deleteTask(index) {
    const confirmationDialog = document.createElement("div");
    confirmationDialog.className = "delete-container";
    confirmationDialog.innerHTML = `
            <div class="delete-container-content">
                <span>Delete this task?</span>
                <div class="delete-buttons">
                    <button class="yes-button">Yes</button>
                    <button class="no-button">No</button>
                </div>
            </div>`;
    root.appendChild(confirmationDialog);
    const yesButton = confirmationDialog.querySelector(".yes-button");
    const noButton = confirmationDialog.querySelector(".no-button");
    yesButton.addEventListener("click", () => {
      tasks.splice(index, 1);
      if (tasks.length === 0) {
        hasTasks = false;
      }
      root.removeChild(confirmationDialog);
      render();
    });
    noButton.addEventListener("click", () => {
      root.removeChild(confirmationDialog);
    });
  }
  render();
}
MainPage();
