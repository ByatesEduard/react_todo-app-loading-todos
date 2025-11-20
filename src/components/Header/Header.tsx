import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        disabled
      />

      {/* Add a todo on form submit */}
      <form>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled
        />
      </form>
    </header>
  );
};

// Додати форму з інпутом для створення нового завдання.
