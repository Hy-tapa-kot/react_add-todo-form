import { useState } from 'react'
import './App.scss'

import todosFromServer from './api/todos'
import usersFromServer from './api/users'

interface Todo {
  id: number;
  title: string;
  userId: number;
  completed: boolean;
}

export const App = () => {
  const [todos, setTodos] = useState<Todo[]>(todosFromServer);
  const [title, setTitle] = useState<string>('');
  const [userId, setUserId] = useState<number>(0);  // Changed to number
  const [errors, setErrors] = useState<{ title: boolean; user: boolean }>({
    title: false,
    user: false,
  });

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newErrors = {
      title: title.trim() === '',
      user: userId === 0,
    };

    setErrors(newErrors);
    if (newErrors.title || newErrors.user) return;

    const newTodo: Todo = {
      id: Math.max(0, ...todos.map((todo) => todo.id)) + 1,
      title: title.trim().replace(/[^a-zA-Zа-яА-ЯёЁіІїЇєЄ0-9 ]/g, ''),
      userId: userId,
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setTitle('');
    setUserId(0);
  };

  return (
    <div className="App">
      <h1>Add todo form</h1>

      <form onSubmit={handleAddTodo}>
        <div className="field">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            data-cy="titleInput"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setErrors((prev) => ({ ...prev, title: false }));
            }}
            placeholder="Enter todo title"
          />
          {errors.title && <span className="error">Please enter a title</span>}
        </div>

        <div className="field">
          <label htmlFor="user">User:</label>
          <select
            data-cy="userSelect"
            value={userId}
            onChange={(e) => {
              setUserId(Number(e.target.value));  // Convert to number
              setErrors((prev) => ({ ...prev, user: false }));
            }}
          >
            <option value={0} disabled>
              Choose a user
            </option>
            {usersFromServer.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          {errors.user && <span className="error">Please choose a user</span>}
        </div>

        <button type="submit" data-cy="submitButton">
          Add
        </button>
      </form>

      <section className="TodoList">
        {todos.map((todo) => {
          const user = usersFromServer.find(user => user.id === todo.userId);
          const userEmail = user ? user.email : 'default@example.com';  // Fallback email
          const userName = user ? user.name : 'Unknown User';

          return (
            <article
              key={todo.id}
              data-id={todo.id}
              className={`TodoInfo ${todo.completed ? 'TodoInfo--completed' : ''}`}
            >
              <h2 className="TodoInfo__title">{todo.title}</h2>
              <a className="UserInfo" href={`mailto:${userEmail}`}>
                {userName}
              </a>
            </article>
          );
        })}
      </section>
    </div>
  );
};
