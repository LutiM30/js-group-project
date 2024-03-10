const demoTitle =
  "Lorem ipsum dolor sit amet, incididunt adipisicing pariatur enim.";
const demoDesc =
  "Lorem ipsum dolor sit amet, laboris aute ea consectetur dolore adipisicing sit nulla aliqua.";

const demoAssigned = ["Varshil", "Mitul"];
const demoPriority = "Low";
const demoDeadline = "2024-03-31";
const taskPriorityColors = {
  high: `bg-red-900`,
  medium: "bg-yellow-900",
  low: "bg-green-900",
};

let selectedAssignedValues = [];
const getRandomOfArray = (arr = []) => {
  const randomIndex = Math.floor(Math.random() * arr.length);

  return arr[randomIndex];
};
const localStorageTasks = "tasks";

const hide = " hidden";

let tasks = [];

const colors = [
  "blue",
  "red",
  "green",
  "amber",
  "pink",
  "indigo",
  "purple",
  "teal",
  "cyan",
];

const localStorageTasksArr = JSON.parse(
  localStorage?.getItem(localStorageTasks)
);

if (!localStorageTasksArr || localStorageTasksArr.length === 0) {
  tasks = [
    {
      title: demoTitle,
      description: demoDesc,
      assigned: demoAssigned,
      priority: demoPriority,
      deadline: demoDeadline,
    },
  ];
} else {
  tasks = localStorageTasksArr;
}

const taskCardHTML = (title, description, assigned, priority, deadline) =>
  ` <div class="flex justify-between items-center">
  <div class="flex flex-col">
    <strong class="text-white">${title}</strong>
    <p class="text-gray-300">${description}</p>
${
  assigned
    ? `<div class="flex items-center space-x-2">
        <h1 class="text-lg text-black-500 font-bold">Assigned to :</h1>
        <span class="text-white">${assigned.join(", ")}</span>
    </div>`
    : ""
}
${
  priority
    ? `<div class="flex items-center space-x-2">
        <h1 class="text-lg text-black-500 font-bold">Priority :</h1>
        <span class="text-white">${priority}</span>
    </div>`
    : ""
}
 
 ${
   deadline
     ? `<div class="flex items-center space-x-2">
        <h1 class="text-lg text-black-500 font-bold">Deadline :</h1>
        <span class="text-white">${deadline}</span>
    </div>`
     : ""
 }
  </div>

  <div class="flex space-x-2 task-buttons">
    <button class="text-red-500 hover:text-red-600 delete-button" title="Delete">
      <i class="fas fa-trash text-black hover:text-red-900"></i>
    </button>
    <button class="text-blue-500 hover:text-blue-600 edit-button" title="Edit">
      <i class="fas fa-edit text-blue-500 hover:text-blue-600"></i>
    </button>
  </div>
</div>
`;

const setError = (errorMessage = "") => $("#error").html(errorMessage);

const additionalFunctionality = {
  keybindings: {
    createTask: (e) =>
      e.ctrlKey && e.keyCode === 13 ? TasksCRUD.Create() : "",
    focusTask: (e) =>
      e.ctrlKey && e?.keyCode === 73 ? $("#taskTitle").focus() : "",
    focusSearch: (e) =>
      e.ctrlKey && e.keyCode === 191 ? $("#taskSearch").focus() : "",
  },
  changePlaceHolder: () => {
    const tasksTitle = tasks?.map((task) => task.title);

    $("#taskSearch").attr(
      "placeholder",
      `Ctrl + / for search (${
        getRandomOfArray(tasksTitle) || "No Tasks right now"
      })`
    );
  },
  lostFocus: () =>
    $("#taskTitle").val() && $("#taskDescription").val() && TasksCRUD.Create(),
  toggleDropdown: () => {
    $("#dropdownDefaultCheckbox").attr("class", (i, origValue) =>
      origValue.includes(hide) ? origValue.replace(hide, "") : origValue + hide
    );
  },
  randomClassForChip: () =>
    `bg-gradient-to-tr from-${getRandomOfArray(
      colors
    )}-900 to-${getRandomOfArray(colors)}-800`,
};

const updateSelectedAssignedValues = () => {
  selectedAssignedValues.length = 0;
  $(".assign-selected").empty();

  $('#dropdownDefaultCheckbox input[type="checkbox"]').each(function () {
    if ($(this).prop("checked")) {
      const selectedValue = $(this).val().trim();
      selectedAssignedValues.push(selectedValue);
      $(".assign-selected").append(
        `<div
          class="relative grid select-none items-center whitespace-nowrap rounded-lg bg-teal-500    py-1.5 px-3 font-sans text-xs font-bold uppercase text-white ${additionalFunctionality.randomClassForChip()}">
          <span class="">${selectedValue}</span>
        </div>`
      );
    }
  });
};

const TasksCRUD = {
  Create: () => {
    const title = $("#taskTitle").val();
    const description = $("#taskDescription").val();
    const assigned = [...selectedAssignedValues];
    const priority = $("#dropdownPriority").val()?.toLowerCase();
    const deadline = $("#deadlineDate").val();

    if (title && description && assigned.length > 0 && priority && deadline) {
      tasks.push({ title, description, assigned, priority, deadline });

      TasksCRUD.Read();
      // Clear input fields
      $("#taskTitle").val("");
      $("#taskDescription").val("");
      $('#dropdownDefaultCheckbox input[type="checkbox"]').prop(
        "checked",
        false
      );
      selectedAssignedValues.length = 0;
      $(".assign-selected").empty();

      $("#dropdownPriority").val("");
      $("#deadlineDate").val("");

      //focus on title
      $("#taskTitle").focus();
      additionalFunctionality.toggleDropdown();
      setError("");
    } else {
      let errorMessage = "";

      if (!title) {
        errorMessage = "Title is required.";
      } else if (!description) {
        errorMessage = "Description is required.";
      } else if (assigned.length === 0) {
        errorMessage = "At least one assignee is required.";
      } else if (!priority) {
        errorMessage = "Priority is required.";
      } else if (!deadline) {
        errorMessage = "Deadline is required.";
      } else {
        return true;
      }

      setError(errorMessage);
    }
  },
  Read: () => {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = ""; // Clear existing tasks

    const searchQuery = $("#taskSearch").val()?.toLowerCase();

    const filteredTasks = searchQuery
      ? tasks?.filter((task) => {
          const title = task.title.toLowerCase();
          const description = task.description.toLowerCase();
          const assignedTo = task?.assigned?.join(", ").toLowerCase();
          const priority = task?.priority?.toLowerCase();
          const deadline = task?.deadline?.toLowerCase();

          return (
            title?.match(searchQuery)?.length > 0 ||
            description?.match(searchQuery)?.length > 0 ||
            assignedTo?.match(searchQuery)?.length > 0 ||
            priority?.match(searchQuery)?.length > 0 ||
            deadline?.match(searchQuery)?.length > 0
          );
        })
      : tasks;

    filteredTasks.forEach((task, index) => {
      const taskItem = document.createElement("li");
      taskItem.classList.add("bg-gray-800", "p-2", "rounded-md", "shadow-sm");
      taskItem.classList.add(
        taskPriorityColors[task?.priority?.toLowerCase() || demoPriority]
      );

      taskItem.innerHTML = taskCardHTML(
        task.title,
        task.description,
        task.assigned,
        task.priority,
        task.deadline
      );

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

    $('#dropdownDefaultCheckbox input[type="checkbox"]').each(function () {
      if (tasks[index].assigned.includes($(this).val())) {
        $(this).prop("checked", true); // Check the checkbox if the assigned value matches
        selectedAssignedValues.push($(this).val()); // Push the value to the selectedAssignedValues array

        $("#dropdownDefaultCheckbox").removeClass("hidden");

        $(".assign-selected").append(
          `<div class="flex-initial p-2 bg-white text-black rounded-md">${$(
            this
          ).val()}</div>`
        );
      } else {
        $(this).prop("checked", false);
      }
    });

    $("#dropdownPriority").val(tasks[index].priority);
    $("#deadlineDate").val(tasks[index].deadline);
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
  $("#dropdownCheckboxButton").click(additionalFunctionality.toggleDropdown);

  $('#dropdownDefaultCheckbox input[type="checkbox"]').change(function () {
    updateSelectedAssignedValues();
  });

  $(window).blur(additionalFunctionality.lostFocus);

  $(document).keydown(additionalFunctionality.keybindings.createTask);
  $(document).keydown(additionalFunctionality.keybindings.focusTask);
  $(document).keydown(additionalFunctionality.keybindings.focusSearch);

  setInterval(additionalFunctionality.changePlaceHolder, 2 * 1000);

  // search functionality
  $("#taskSearch").on("keyup", TasksCRUD.Read);

  // initial rendering
  TasksCRUD.Read();
});
