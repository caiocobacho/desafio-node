const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
function validateProjectId(request, response, next) {
  const { id } = request.params

  if(!isUuid(id)) {
    return response.status(400).json({ error: "Invalid Repository ID." })
  }

  return next()
}

app.use("/repositories/:id", validateProjectId)

app.get("/repositories", (request, response) => {
  const {title, likes} = request.query;
  const results = title ? repositories.filter(repository => repository.title.includes(title,likes)): repositories

  return response.json(results);
  
});

app.post("/repositories", (request, response) => {
  const {title,url,techs, } = request.body;
  const repository = { id: uuid(), title, url,techs,likes: 0 };
  repositories.push(repository)
  console.log(repositories)
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title,url,techs} = request.body;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  if(repositoryIndex < 0){
    return response.status(400).json({error: 'Repository not found! 😕 '})
  }
  const repository = {
    id,
    title,
    url,
    techs
  }
  repositories[repositoryIndex] = repository
  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const {id}= request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  if(repositoryIndex< 0){
    return response.status(400).json({error: 'Repository not found! 😕'})
  }
  repositories.splice(repositoryIndex,1)
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found! 😕" })
  }

  const likes = repositories[repositoryIndex].likes + 1
  const repository = { ...repositories[repositoryIndex], likes }

  repositories[repositoryIndex] = repository

  return response.json(repository)
});

module.exports = app;
