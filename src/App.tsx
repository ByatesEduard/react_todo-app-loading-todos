/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos } from './api/todos';
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
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterEnum>(FilterEnum.all);
  const [isLoaded, setIsLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load todos
  useEffect(() => {
    const loadTodos = async () => {
      try {
        setIsLoaded(true);
        const todosFromApi = await getTodos();
        setTodos(todosFromApi);
      } catch {
        setErrorMessage('Something went wrong. Please try again later.');
        setTimeout(() => setErrorMessage(null), 3000);
      } finally {
        setIsLoaded(false);
      }
    };

    loadTodos();
  }, []);

  // Filtering logic
  useEffect(() => {
    switch (filter) {
      case FilterEnum.active:
        setFilteredTodos(todos.filter(todo => !todo.completed));
        break;

      case FilterEnum.completed:
        setFilteredTodos(todos.filter(todo => todo.completed));
        break;

      default:
        setFilteredTodos(todos);
    }
  }, [todos, filter]);

  // Toggle completed
  const toggleTodoCompleted = (todoId: number) => {
    setIsLoaded(true);

    setTodos(prev =>
      prev.map(todo =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
      ),
    );

    setTimeout(() => setIsLoaded(false), 150);
  };

  // Clear completed
  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              isLoaded={isLoaded}
              toggleTodoCompleted={toggleTodoCompleted}
            />
          ))}
        </section>

        {todos.length > 0 && (
          <Footer
            activeCount={todos.filter(t => !t.completed).length}
            filter={filter}
            onFilterChange={setFilter}
            hasCompleted={todos.some(t => t.completed)}
            onClearCompleted={clearCompleted}
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
