/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';

import { Header } from './components/Header/Header';
import { TodoItem } from './components/TodoItem/TodoItem';
import { Footer } from './components/Footer/Footer';

enum FilterEnum {
  all = 'all',
  active = 'active',
  completed = 'completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterEnum>(FilterEnum.all);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  // Load todos
  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(null), 3000);
      });
  }, []);

  const handleAddTodo = async (title: string) => {
    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(newTodo);
    setErrorMessage(null);

    try {
      const createdTodo = await createTodo(title);

      setTodos((prev) => [...prev, createdTodo]);
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      setTimeout(() => setErrorMessage(null), 3000);
      throw error;
    } finally {
      setTempTodo(null);
    }
  };

  const handleRemoveTodo = async (todoId: number) => {
    setLoadingIds((prev) => [...prev, todoId]);
    setErrorMessage(null);

    try {
      await deleteTodo(todoId);
      setTodos((prev) => prev.filter((t) => t.id !== todoId));
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== todoId));
    }
  };

  const handleUpdateTodo = async (todoId: number, data: Partial<Todo>) => {
    setLoadingIds((prev) => [...prev, todoId]);
    setErrorMessage(null);

    try {
      const updatedTodo = await updateTodo(todoId, data);

      setTodos((prev) => prev.map((t) => (t.id === todoId ? updatedTodo : t)));
    } catch (error) {
      setErrorMessage('Unable to update a todo');
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== todoId));
    }
  };

  const handleClearCompleted = () => {
    todos.forEach((todo) => {
      if (todo.completed) {
        handleRemoveTodo(todo.id);
      }
    });
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === FilterEnum.active) {
      return !todo.completed;
    }

    if (filter === FilterEnum.completed) {
      return todo.completed;
    }

    return true;
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header onAdd={handleAddTodo} isLoaded={!!tempTodo} />

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              isLoaded={!!tempTodo}
              isLoading={loadingIds.includes(todo.id)}
              toggleTodoCompleted={(id) =>
                handleUpdateTodo(id, { completed: !todo.completed })
              }
              removeTodo={handleRemoveTodo}
              updateTodo={(id, title) => handleUpdateTodo(id, { title })}
            />
          ))}

          {tempTodo && (
            <TodoItem
              todo={tempTodo}
              isLoaded={true}
              isLoading={true}
              toggleTodoCompleted={() => {}}
              removeTodo={() => {}}
              updateTodo={() => {}}
            />
          )}
        </section>

        {todos.length > 0 && (
          <Footer
            activeCount={todos.filter((t) => !t.completed).length}
            filter={filter}
            onFilterChange={(newFilter) => setFilter(newFilter as FilterEnum)}
            hasCompleted={todos.some((t) => t.completed)}
            onClearCompleted={handleClearCompleted}
          />
        )}

        {errorMessage && (
          <div
            data-cy="ErrorNotification"
            className="notification is-danger is-light has-text-weight-normal"
          >
            <button
              data-cy="HideErrorButton"
              type="button"
              className="delete"
              onClick={() => setErrorMessage(null)}
            />
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};
