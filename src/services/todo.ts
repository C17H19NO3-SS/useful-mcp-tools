import { promises as fs } from "fs";
import path from "path";

const DATA_PATH = path.resolve("data/todos.json");

export type Todo = {
  id: string;
  content: string;
  completed: boolean;
};

async function readTodos(): Promise<Todo[]> {
  try {
    const data = await fs.readFile(DATA_PATH, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

async function writeTodos(todos: Todo[]) {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(todos, null, 2), "utf-8");
}

export async function listTodos(): Promise<Todo[]> {
  return readTodos();
}

export async function addTodo(content: string): Promise<Todo> {
  const todos = await readTodos();
  const todo: Todo = {
    id: Date.now().toString() + Math.random().toString(36).slice(2),
    content,
    completed: false,
  };
  todos.push(todo);
  await writeTodos(todos);
  return todo;
}

export async function completeTodo(id: string): Promise<Todo | null> {
  const todos = await readTodos();
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.completed = true;
    await writeTodos(todos);
    return todo;
  }
  return null;
}

export async function deleteTodo(id: string): Promise<boolean> {
  const todos = await readTodos();
  const newTodos = todos.filter((t) => t.id !== id);
  if (newTodos.length !== todos.length) {
    await writeTodos(newTodos);
    return true;
  }
  return false;
}

export async function exportTodos(): Promise<string> {
  const todos = await readTodos();
  return JSON.stringify(todos, null, 2);
}

export async function importTodos(json: string): Promise<Todo[]> {
  let todos: Todo[];
  try {
    todos = JSON.parse(json);
    if (!Array.isArray(todos)) throw new Error("Geçersiz format");
    // Temel doğrulama
    todos = todos.map((t) => ({
      id: String(t.id),
      content: String(t.content),
      completed: Boolean(t.completed),
    }));
    await writeTodos(todos);
    return todos;
  } catch (e) {
    throw new Error("Geçersiz JSON veya todo formatı");
  }
}
