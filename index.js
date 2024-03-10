// Consts
const demoTitle =
  "Lorem ipsum dolor sit amet, incididunt adipisicing pariatur enim.";
const demoDesc =
  "Lorem ipsum dolor sit amet, laboris aute ea consectetur dolore adipisicing sit nulla aliqua.";

const localStorageTasks = "tasks";

const hide = " hidden";

// localStorage data
const localStorageTasksArr = JSON.parse(
  localStorage?.getItem(localStorageTasks)
);

// If there's no entity in the browser of tasks it'll automaticallyy create demo task
const sampleArr = [
  {
    title: demoTitle,
    description: demoDesc,
  },
];

const tasks = Array.isArray(localStorageTasksArr)
  ? localStorageTasksArr
  : sampleArr;

// HTML for task card
const taskCardHTML = (title = demoTitle, desc = demoDesc) =>
  `
<div class="flex justify-between items-center">
  <div>
    <strong class="text-white">${title}</strong>
    <p class="text-gray-300">${desc}</p>
  </div>

  <div class="flex space-x-2 task-buttons">
    <button class="text-red-500 hover:text-red-600 delete-button" title="Delete" on>
      <i class="fas fa-trash text-red-500 hover:text-red-600"></i>
    </button>
    <button class="text-blue-500 hover:text-blue-600 edit-button" title="Edit">
      <i class="fas fa-edit text-blue-500 hover:text-blue-600"></i>
    </button>
  </div>
</div>
`;

// Error to show
const setError = (errorMessage = "") => $("#error").html(errorMessage);

// it contains some things which contains are additional things of the project like shortcut keys etc.
const additionalFunctionality = {
  keybindings: {
    createTask: (e) =>
      e.ctrlKey && e.keyCode === 13 ? TasksCRUD.Create() : "",

    focusTask: (e) =>
      e.ctrlKey && e?.keyCode === 75 ? $("#taskTitle").focus() : "",

    focusSearch: (e) =>
      e.ctrlKey && e.keyCode === 191 ? $("#taskSearch").focus() : "",
  },

  // Search Input contains placeholders whihch changes every two seconds
  //  it shows exsiting Task's title randomly
  changePlaceHolder: () => {
    const tasksTitle = tasks?.map((task) => task.title);
    const randomIndex = Math.floor(Math.random() * tasksTitle.length);

    $("#taskSearch").attr(
      "placeholder",
      `Ctrl + / for search (${tasksTitle[randomIndex] || "No Tasks right now"})`
    );
  },

  //  When Editing the Task if window gets changed it'll store the task if title and description are there.
  lostFocus: () =>
    $("#taskTitle").val() && $("#taskDescription").val() && TasksCRUD.Create(),

  // open the dropdown by passing the id of the dropdown
  toggleDropdown: (dropdownId) => () => {
    $(`#${dropdownId}`).attr("class", (i, origValue) =>
      origValue.includes(hide) ? origValue.replace(hide, "") : origValue + hide
    );
  },
};

// Things Related to task
const TasksCRUD = {
  Create: () => {
    const title = $("#taskTitle").val();
    const description = $("#taskDescription").val();

    if (title && description) {
      tasks.push({ title, description });

      TasksCRUD.Read();
      // Clear input fields
      $("#taskTitle").val("");
      $("#taskDescription").val("");

      //focus on title
      $("#taskTitle").focus();
      setError("");
    } else {
      setError("Title and Description is Required");
    }
  },

  Read: () => {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = ""; // Clear existing tasks

    const searchQuery = $("#taskSearch").val()?.toLowerCase();

    const filteredTasks = searchQuery
      ? tasks?.filter(
          (task) =>
            task.title.toLowerCase().match(searchQuery)?.length > 0 ||
            task.description.toLowerCase().match(searchQuery)?.length > 0
        )
      : tasks;

    filteredTasks.forEach((task, index) => {
      const taskItem = document.createElement("li");
      taskItem.classList.add("bg-gray-800", "p-2", "rounded-md", "shadow-sm");
      taskItem.innerHTML = taskCardHTML(task.title, task.description);

      // delete button functionality
      const deleteButton = taskItem.querySelector(".delete-button");
      deleteButton.addEventListener("click", () => TasksCRUD.Delete(index));

      // edit button functionality
      const editButton = taskItem.querySelector(".edit-button");
      editButton.addEventListener("click", () => TasksCRUD.Update(index));

      taskList.appendChild(taskItem);
    });

    localStorage.setItem(localStorageTasks, JSON.stringify(tasks));
  },

  Update: (index) => {
    $("#taskTitle").val(tasks[index].title);
    $("#taskDescription").val(tasks[index].description);
    $("#taskTitle").focus();
    TasksCRUD.Delete(index);
  },

  Delete: (index) => {
    tasks.splice(index, 1); // Remove the task at the specified index
    TasksCRUD.Read();
  },
};

$(document).ready(() => {
  $("#addTask").click(TasksCRUD.Create);
  $("#assigneeButton").click(
    additionalFunctionality.toggleDropdown("assigneeList")
  );

  $(window).blur(additionalFunctionality.lostFocus);

  $(document).keydown(additionalFunctionality.keybindings.createTask);
  $(document).keydown(additionalFunctionality.keybindings.focusTask);
  $(document).keydown(additionalFunctionality.keybindings.focusSearch);

  setInterval(additionalFunctionality.changePlaceHolder, 2 * 1000);

  // search functionality
  $("#taskSearch").on("keypress", TasksCRUD.Read);

  setInterval(TasksCRUD.Read, 300);

  // initial rendering
  TasksCRUD.Read();
});
