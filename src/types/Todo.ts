export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type Props = {
  todo: Todo;
  isLoaded: boolean;
  toggleTodoCompleted: (id: number) => void;
};

export interface FooterProps {
  activeCount: number;
  filter: string;
  onFilterChange: (value: string) => void;
  onClearCompleted: () => void;
  hasCompleted: boolean;
}

export type ErrorMesage = {
  errorMessage: string | null;
};
