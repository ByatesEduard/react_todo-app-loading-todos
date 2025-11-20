import React from 'react';
import classNames from 'classnames';
import { Props } from '../../types/Todo';

export const TodoItem: React.FC<Props> = ({
  todo,
  toggleTodoCompleted,
  isLoaded,
}) => {
  const handlerToggleTodo = (todoId: number) => toggleTodoCompleted(todoId);

  return (
    <div
      data-cy="Todo"
      key={todo.id}
      className={classNames('todo', {
        completed: todo.completed,
        'is-active': isLoaded,
      })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <input
          data-cy="TodoStatus"
          type="checkbox"
          checked={todo.completed}
          className="todo__status"
          onChange={() => handlerToggleTodo(todo.id)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button type="button" className="todo__remove" data-cy="TodoDelete">
        ×
      </button>

      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

// Реалізувати TodoItem.tsx: Верстка одного елемента списку (чекбокс, текст, кнопка видалення).
