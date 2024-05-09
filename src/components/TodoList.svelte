<script>
  let todos = [];
  import {fade,slide} from "svelte/transition";

  async function fetchTodos() {
    const response = await fetch('http://localhost:3000/api/notes');
    todos = await response.json();
  }

  function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodosToServer();

  }

  async function addTodo() {
    const textarea = document.getElementById('exampleFormControlTextarea1');
    const todoText = textarea.value.trim();
    const todoTime = document.getElementById('todoTimeInput').value;
    if (todoText && todoTime) {
      try {
        const response = await fetch('http://localhost:3000/api/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title: todoText, time: todoTime })
        });
        if (!response.ok) {
          throw new Error('Failed to add todo');
        }
        const newTodo = await response.json();
        todos = [...todos, newTodo];
        textarea.value = '';
      } catch (error) {
        console.error(error);
      }
    } else {
      alert('Please enter both todo and time before saving.');
    }
  }


  async function saveTodosToServer() {
    try {
      const response = await fetch('http://localhost:3000/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(todos)
      });
      if (!response.ok) {
        throw new Error('Failed to save todos to server');
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Function to toggle edit mode for a todo
  function toggleEditMode(id) {
    todos = todos.map(todo => {
      if (todo.id === id) {
        return {...todo, editing: !todo.editing}; // Toggle the editing property
      } else {
        return todo;
      }
    });
  }

  // Function to save changes made to a todo
  function saveChanges(id, newTitle) {
    todos = todos.map(todo => {
      if (todo.id === id) {
        return {...todo, title: newTitle, editing: false}; // Update title and disable editing mode
      } else {
        return todo;
      }
    });
    saveTodosToServer(); // Save changes to the server
  }

  fetchTodos(); // Fetch todos on component mount
</script>

<div class="todo-list-container">
  <div class="todo-list">
    <div class="input">
      <textarea required id="exampleFormControlTextarea1" placeholder="Add new todo"></textarea>
      <input type="time" id="todoTimeInput"/> <!-- Time input field -->
      <button type="button" class="btn btn-outline-primary" on:click={addTodo}><i class="bi bi-cloud-plus"></i>
      </button>
    </div>
    <ul>
      {#each todos as todo (todo.id)}
        <li class="todo-item" class:editing="{todo.editing}" transition:fade on:dblclick={() => toggleEditMode(todo.id)}>
          <input type="checkbox" bind:checked={todo.checked} />
          {#if todo.editing}

            <textarea bind:value={todo.title}></textarea> <!-- Editable textarea -->
            <button type="button" class="btn btn-outline-primary" on:click={() => saveChanges(todo.id, todo.title)}>
              Save
            </button>
          {:else}
            <span>{todo.title} :</span> <!-- Display todo title -->

            <span>{todo.time}</span> <!-- Display todo time -->
            <button type="button" class="btn btn-outline-danger" on:click={() => deleteTodo(todo.id)} transition:slide><i class="bi bi-trash3"></i></button>
          {/if}
        </li>
      {/each}
    </ul>
  </div>
</div>
