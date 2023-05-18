const lista = document.getElementById("lista");
const inputDescricao = document.getElementById("inputDescricao");
const btAdd = document.getElementById("btAdd");

const taskUrl = "https://parseapi.back4app.com/classes/Task";
const headers = {
  "X-Parse-Application-Id": "RkjwBkfNZRERi3k4FVjojkTgLLe6CbbTPbW4qrQo",
  "X-Parse-REST-API-Key": "wmn69SVNaLq6UoW177InOj1tnXUsy2fkfvtHagdu",
};

const renderizaLista = (lista, tarefas) => {
    lista.innerHTML = "";
    tarefas.forEach((tarefa) => {
      const itemText = document.createTextNode(tarefa.description);
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = tarefa.concluida;
  
      // Adicione o evento de escuta aqui
      checkbox.addEventListener("change", () => {
        tarefa.concluida = checkbox.checked;
        updateTask(tarefa.objectId, checkbox.checked);
        renderizaLista(lista, tarefas); // Atualiza novamente a lista para refletir as alterações
      });
  
      const buttonDelete = document.createElement("button");
      buttonDelete.innerHTML = "X";
      buttonDelete.onclick = () => deleteTask(tarefa.objectId);
      const listItem = document.createElement("li");
      listItem.appendChild(checkbox);
      listItem.appendChild(itemText);
      listItem.appendChild(buttonDelete);
  
      // Aplica a classe "concluida" se a tarefa estiver concluída
      if (tarefa.concluida) {
        listItem.classList.add("concluida");
      }
  
      lista.appendChild(listItem);
    });
  };

  const getTasks = () => {
    fetch(taskUrl, { headers: headers })
      .then((res) => res.json())
      .then((data) => {
        const checkboxes = Array.from(lista.getElementsByTagName("input"));
        const checkboxStates = checkboxes.map((checkbox) => checkbox.checked);
  
        renderizaLista(lista, data.results);
  
        checkboxes.forEach((checkbox, index) => {
          checkbox.checked = checkboxStates[index];
        });
      });
  };

const handleBtAddClick = () => {
  const description = inputDescricao.value;
  if (!description) {
    alert("É necessário digitar uma descrição!");
    return;
  }
  btAdd.disabled = true;
  fetch(taskUrl, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ description: description }),
  })
    .then((res) => res.json())
    .then((data) => {
      getTasks();
      btAdd.disabled = false;
      inputDescricao.value = "";
      inputDescricao.focus();
      console.log("data", data);
    })
    .catch((err) => {
      btAdd.disabled = false;
      console.log(err);
    });
};

const updateTask = (id, done) => {
    fetch(`${taskUrl}/${id}`, {
    method: "PUT",
    headers: {
    ...headers,
    "Content-Type": "application/json",
    },
    body: JSON.stringify({ done: done }),
    })
    .then((res) => res.json())
    .then((data) => {
    getTasks();
    console.log("data", data);
    })
    .catch((err) => {
    console.log(err);
    });
    };
    
    getTasks();

    const deleteTask = (id) => {
        const deleteUrl = `${taskUrl}/${id}`;
      
        fetch(deleteUrl, {
          method: "DELETE",
          headers: headers
        })
          .then((res) => res.json())
          .then((data) => {
            getTasks();
            console.log("data", data);
          })
          .catch((err) => {
            console.log(err);
          });
      };

      
    btAdd.onclick = handleBtAddClick;