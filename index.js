const demoTitle =
  "Lorem ipsum dolor sit amet, incididunt adipisicing pariatur enim.";
const demoDesc =
  "Lorem ipsum dolor sit amet, laboris aute ea consectetur dolore adipisicing sit nulla aliqua.";

const tasks = [
  {
    title: demoTitle,
    description: demoDesc,
  },
];

const taskCardHTML = (title = demoTitle, desc = demoDesc) =>
  `
<div class="flex justify-between items-center">
  <div>
    <strong class="text-white">${title}</strong>
    <p class="text-gray-300">${desc}</p>
  </div>

  <div class="flex space-x-2 task-buttons">
    <button class="text-red-500 hover:text-red-600" title="Delete">
      <i class="fas fa-trash text-red-500 hover:text-red-600"></i>
    </button>
    <button class="text-blue-500 hover:text-blue-600" title="Edit">
      <i class="fas fa-edit text-blue-500 hover:text-blue-600"></i>
    </button>
  </div>
</div>
`;

// Function to add a task to the list
function addTask() {
  const title = document.getElementById("taskTitle").value;
  const description = document.getElementById("taskDescription").value;

  if (title && description) {
    const taskItem = document.createElement("li");
    taskItem.classList.add("bg-gray-800", "p-2", "rounded-md", "shadow-sm");
    taskItem.innerHTML = taskCardHTML(title, description);

    document.getElementById("taskList").appendChild(taskItem);
    // Clear input fields
    document.getElementById("taskTitle").value = "";
    document.getElementById("taskDescription").value = "";
  }
}

// Initialize with existing tasks
tasks.forEach((task) => {
  const taskItem = document.createElement("li");
  taskItem.classList.add("bg-gray-800", "p-2", "rounded-md", "shadow-sm");
  taskItem.innerHTML = taskCardHTML(task.title, task.description);
  document.getElementById("taskList").appendChild(taskItem);
});
