import classNames from 'classnames';
import React from 'react';

type Props = {
  errorMessage: string | null;
};

export const Error: React.FC<Props> = ({ errorMessage }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: errorMessage === null },
      )}
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {errorMessage && errorMessage}
    </div>
  );
};
