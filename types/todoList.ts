type Todo = {
	completed: boolean;
	id: string;
	task: string;
};

type TodoList = {
	color: string;
	completedTodos: number;
	listName: string;
	todoListId: string;
	todos: Todo[];
	totalTodos: number;
};

export { Todo, TodoList };
