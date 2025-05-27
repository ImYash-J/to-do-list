const addBtn = document.getElementById('add-task-btn');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const errorMsg = document.getElementById('error-msg');
const statusMsg = document.getElementById('status-msg');

// Load tasks from localStorage on page load
window.addEventListener('DOMContentLoaded', () => {
  const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  savedTasks.forEach(task => addTask(task.text, task.completed));
});

// Add task button click
addBtn.addEventListener('click', () => {
  const taskText = taskInput.value.trim();
  errorMsg.textContent = '';
  statusMsg.textContent = '';

  if (taskText === '') {
    errorMsg.textContent = 'Task cannot be empty!';
    return;
  }

  if (isDuplicateTask(taskText)) {
    errorMsg.textContent = 'Duplicate task is not allowed!';
    return;
  }

  addTask(taskText);
  saveTasks();
  taskInput.value = '';
  showStatusMessage(`Task "${taskText}" added.`);
});

// Check for duplicates
function isDuplicateTask(task) {
  const tasks = document.querySelectorAll('#task-list li span');
  return Array.from(tasks).some(
    t => t.textContent.trim().toLowerCase() === task.toLowerCase()
  );
}

// Add task to list
function addTask(task, completed = false) {
  const li = document.createElement('li');
  if (completed) li.classList.add('completed');

  const taskSpan = document.createElement('span');
  taskSpan.textContent = task;

  const buttons = document.createElement('div');
  buttons.className = 'task-buttons';

  // Complete Button
  const completeBtn = document.createElement('button');
  completeBtn.className = 'complete';
  completeBtn.innerHTML = '✓';
  completeBtn.onclick = () => {
    li.classList.toggle('completed');
    saveTasks();
    const isCompleted = li.classList.contains('completed');
    showStatusMessage(
      isCompleted
        ? `"${taskSpan.textContent}" marked as completed.`
        : `"${taskSpan.textContent}" marked as not completed.`
    );
  };

  // Edit Button
  const editBtn = document.createElement('button');
  editBtn.className = 'edit';
  editBtn.innerHTML = '✎';
  editBtn.onclick = () => {
    const newText = prompt('Edit task:', taskSpan.textContent);
    if (newText && newText.trim() !== '') {
      const trimmedText = newText.trim();
      if (
        trimmedText.toLowerCase() !== taskSpan.textContent.toLowerCase() &&
        isDuplicateTask(trimmedText)
      ) {
        alert('Task already exists.');
        return;
      }
      taskSpan.textContent = trimmedText;
      saveTasks();
      showStatusMessage(`Task updated to "${trimmedText}".`);
    } else {
      alert('Edited task cannot be empty.');
    }
  };

  // Delete Button
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete';
  deleteBtn.innerHTML = '✗';
  deleteBtn.onclick = () => {
    li.remove();
    saveTasks();
    showStatusMessage(`"${taskSpan.textContent}" deleted.`);
  };

  buttons.appendChild(completeBtn);
  buttons.appendChild(editBtn);
  buttons.appendChild(deleteBtn);

  li.appendChild(taskSpan);
  li.appendChild(buttons);
  taskList.appendChild(li);
}

// Save all tasks to localStorage
function saveTasks() {
  const tasks = [];
  document.querySelectorAll('#task-list li').forEach(li => {
    tasks.push({
      text: li.querySelector('span').textContent.trim(),
      completed: li.classList.contains('completed')
    });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Show status messages
function showStatusMessage(message) {
  statusMsg.textContent = message;
  setTimeout(() => {
    statusMsg.textContent = '';
  }, 3000);
}
