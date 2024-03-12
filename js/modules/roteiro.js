// Seleção de elementos
const todoForm = document.querySelector('#todo-form');
const todoInput = document.querySelector('#todo-input');
const todoList = document.querySelector('#todo-list');
const editForm = document.querySelector('#edit-form');
const editInput = document.querySelector('#edit-input');
const cancelEditBtn = document.querySelector('#cancel-edit-btn');
const searchInput = document.querySelector('#search-input');
const eraseBtn = document.querySelector('#erase-button');
const filterBtn = document.querySelector('#filter-select');

let oldInputValue;

// Funções
// Save a partir de 1 permite salvar os arquivos no localStorage
const saveTodo = (text, done = 0, save = 1) => {
  //Criar uma div e adicionar uma class
  const todo = document.createElement('div');
  todo.classList.add('todo');

  //Adicionar o título do roteiro com h3
  const todoTitle = document.createElement('h3');
  todoTitle.innerText = text;
  todo.appendChild(todoTitle);

  //Criar botão de atividade realizada
  const doneBtn = document.createElement('button');
  doneBtn.classList.add('finish-todo');
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  todo.appendChild(doneBtn);

  //Criar botão de edição da atividade
  const editBtn = document.createElement('button');
  editBtn.classList.add('edit-todo');
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  todo.appendChild(editBtn);

  //Criar botão para remover a atividade
  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('remove-todo');
  deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  todo.appendChild(deleteBtn);

  //Adicionar a class done
  if (done) {
    todo.classList.add('done');
  }

  //Quando tiver um texto o done vai ser 0
  if (save) {
    saveTodoLocalStorage({ text, done: 0 });
  }

  //Colocar na div todoList o filho todo com as demais class de h3 e botões
  todoList.appendChild(todo);

  //Inicia sem valor nenhum no adicione roteiro, apenas utilizando o placeholder
  todoInput.value = '';
};

//Deixar o display escondido do editForm quando o todoDomr e todoList estiverem habilitados
const toggleForms = () => {
  editForm.classList.toggle('hide');
  todoForm.classList.toggle('hide');
  todoList.classList.toggle('hide');
};

//Atualiaza o antigo nome com o novo nome escrito
const updateTodo = (text) => {
  const todos = document.querySelectorAll('.todo');

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector('h3');

    if (todoTitle.innerText === oldInputValue) {
      todoTitle.innerText = text;

      updateTodoLocalStorage(oldInputValue, text);
    }
  });
};

//A função permite procurar palavras tanto em letras maiusculas quanto minusculas
const getSearchedTodos = (search) => {
  // Convertendo a string de pesquisa para minúsculo
  const searchLowerCase = search.toLowerCase();
  const todos = document.querySelectorAll('.todo');

  todos.forEach((todo) => {
    const todoTitle = todo.querySelector('h3').innerText.toLowerCase();

    todo.style.display = 'flex';

    // console.log(todoTitle);

    if (!todoTitle.includes(searchLowerCase)) {
      todo.style.display = 'none';
    }
  });
};

//Permite filtarr cada atividade
const filterTodos = (filterValue) => {
  const todos = document.querySelectorAll('.todo');

  switch (filterValue) {
    case 'all':
      todos.forEach((todo) => (todo.style.display = 'flex'));

      break;

    case 'done':
      todos.forEach((todo) =>
        todo.classList.contains('done')
          ? (todo.style.display = 'flex')
          : (todo.style.display = 'none'),
      );
      break;

    case 'todo':
      todos.forEach((todo) =>
        !todo.classList.contains('done')
          ? (todo.style.display = 'flex')
          : (todo.style.display = 'none'),
      );
      break;

    default:
      break;
  }
};

// Eventos

//É o evento utilizado para salvar o roteiro no local Storage digitado pelo usuário quando não estiver vazio
todoForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const inputValue = todoInput.value;
  if (inputValue) {
    saveTodo(inputValue);
  }
});

document.addEventListener('click', (e) => {
  //target serve para ver onde o evento foi disparado no DOM
  const targetEl = e.target;

  //closest serve para encontrar um container especifico para manipular
  const parentEl = targetEl.closest('div');
  let todoTitle;

  //depois de encontrar o elemento especifico acrescenta o texto digitado ao display
  if (parentEl && parentEl.querySelector('h3')) {
    todoTitle = parentEl.querySelector('h3').innerText || '';
  }

  //quando o botão de atividade feita está marcado a class done surge fazendo o efeito de linha nas palavras e também atualiza a demanda para o local Storage
  if (targetEl.classList.contains('finish-todo')) {
    parentEl.classList.toggle('done');

    updateTodoStatusLocalStorage(todoTitle);
  }

  //aqui quando apertamos o botão de remover retimos tanto da tela quanto do local Storage
  if (targetEl.classList.contains('remove-todo')) {
    parentEl.remove();

    removeTodoLocalStorage(todoTitle);
  }

  //edit-todo está escondido e só aparece quando é acionado pelo botão e edita o texto antigo pelo novo
  if (targetEl.classList.contains('edit-todo')) {
    toggleForms();

    editInput.value = todoTitle;
    oldInputValue = todoTitle;
  }
});

//quando a edição está aberta e clicamos no cancelar troca a tela para a outra que está escondida
cancelEditBtn.addEventListener('click', (e) => {
  e.preventDefault();

  toggleForms();
});

//quando o formulário é iniado pode ser feita a ação de atualizar o roteiro
editForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const editInputValue = editInput.value;

  if (editInputValue) {
    updateTodo(editInputValue);
  }
  toggleForms();
});

//realizar a pesquisa de tarefas
searchInput.addEventListener('keyup', (e) => {
  const search = e.target.value;

  getSearchedTodos(search);
});

// limpa as palavras digitadas pelo usuário
eraseBtn.addEventListener('click', (e) => {
  e.preventDefault();

  searchInput.value = '';

  searchInput.dispatchEvent(new Event('keyup'));
});

// filtrar as tarefas que o usuário fez ou não ainda
filterBtn.addEventListener('change', (e) => {
  const filterValue = e.target.value;

  filterTodos(filterValue);
});

//função para armazer os dados no local storage
const getTodosLocalStorage = () => {
  const todos = JSON.parse(localStorage.getItem('todos')) || [];

  return todos;
};

// função para carregar todas as tarefas do local storage
const loadTodos = () => {
  const todos = getTodosLocalStorage();

  todos.forEach((todo) => {
    saveTodo(todo.text, todo.done, 0);
  });
};

//salvar uma nova tarefa no local storage
const saveTodoLocalStorage = (todo) => {
  const todos = getTodosLocalStorage();

  todos.push(todo);

  localStorage.setItem('todos', JSON.stringify(todos));
};

//remove uma tarefa do local storage
const removeTodoLocalStorage = (todoText) => {
  //obtem todo armazenamento no local storage
  const todos = getTodosLocalStorage();

  const filteredTodos = todos.filter((todo) => todo.text != todoText);

  localStorage.setItem('todos', JSON.stringify(filteredTodos));
};

//atualizar o status de conclusão de uma tarefa no local storage
const updateTodoStatusLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();

  todos.map((todo) =>
    todo.text === todoText ? (todo.done = !todo.done) : null,
  );

  localStorage.setItem('todos', JSON.stringify(todos));
};

// atualizar o texto modificado pelo usuário o local storage
const updateTodoLocalStorage = (todoOldText, todoNewText) => {
  const todos = getTodosLocalStorage();

  todos.map((todo) =>
    todo.text === todoOldText ? (todo.text = todoNewText) : null,
  );

  localStorage.setItem('todos', JSON.stringify(todos));
};
loadTodos();
