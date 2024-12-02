export const appwriteConfig = {
	endpoint: "https://cloud.appwrite.io/v1",
	platform: "com.masc.todolist",
	projectId: "",
	databaseId: "",
	userCollectionId: "",
	todoListId: "",
	todosId: "",
	storageId: "",
};

import {
	Client,
	Account,
	ID,
	Avatars,
	Databases,
	Query,
	Storage,
	ImageGravity,
} from "react-native-appwrite";
import { ImagePickerAsset } from "expo-image-picker";

const client = new Client();
const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

client
	.setEndpoint(appwriteConfig.endpoint)
	.setProject(appwriteConfig.projectId)
	.setPlatform(appwriteConfig.platform);

export async function createUser(
	email: string,
	password: string,
	username: string
) {
	try {
		const newAccount = await account.create(
			ID.unique(),
			email,
			password,
			username
		);

		if (!newAccount) throw Error;

		const avatarUrl = avatars.getInitials(username);

		await signIn(email, password);

		const newUser = await databases.createDocument(
			appwriteConfig.databaseId,
			appwriteConfig.userCollectionId,
			ID.unique(),
			{
				accountId: newAccount.$id,
				email: email,
				username: username,
				avatar: avatarUrl,
			}
		);

		return newUser;
	} catch (error: any) {
		throw new Error(error);
	}
}

export async function signIn(email: string, password: string) {
	try {
		const session = await account.createEmailPasswordSession(email, password);

		return session;
	} catch (error: any) {
		throw new Error(error);
	}
}

export async function getAccount() {
	try {
		const currentAccount = await account.get();

		return currentAccount;
	} catch (error: any) {
		throw new Error(error);
	}
}

export async function getCurrentUser() {
	try {
		const currentAccount = await getAccount();
		if (!currentAccount) throw Error("No Error Found");

		const currentUser = await databases.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.userCollectionId,
			[Query.equal("accountId", currentAccount.$id)]
		);

		if (!currentUser) throw Error("No User Found");

		return currentUser.documents[0];
	} catch (error: any) {
		console.log(error);
		return null;
	}
}

export async function signOut() {
	try {
		const session = await account.deleteSession("current");

		return session;
	} catch (error: any) {
		throw new Error(error);
	}
}

export async function createTodoList(
	userId: string,
	name: string,
	color: string
) {
	try {
		const newTodoList = await databases.createDocument(
			appwriteConfig.databaseId,
			appwriteConfig.todoListId,
			ID.unique(),
			{
				users: userId,
				name,
				color,
			}
		);

		return newTodoList;
	} catch (error: any) {
		throw new Error(error);
	}
}

export async function getTodoLists(userId: string) {
	try {
		const todoLists = await databases.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.todoListId,
			[Query.equal("users", userId), Query.orderDesc("$createdAt")]
		);

		const todoListCount = todoLists?.total || 0;

		const todoListsWithTodos = await Promise.all(
			todoLists.documents.map(async (todoList) => {
				const todos = await databases.listDocuments(
					appwriteConfig.databaseId,
					appwriteConfig.todosId,
					[Query.equal("todoList", todoList.$id)]
				);

				const completedTodosCount = todos.documents.filter(
					(todo) => todo.completed
				).length;

				return {
					id: todoList.$id,
					createdAt: todoList.$createdAt,
					name: todoList.name,
					color: todoList.color,
					todos: todos.documents.map((todo) => ({
						id: todo.$id,
						task: todo.task,
						completed: todo.completed,
					})),
					todoCount: todos?.total || 0,
					completedTodosCount,
				};
			})
		);

		return { todoLists: todoListsWithTodos, todoListCount };
	} catch (error: any) {
		throw new Error(error);
	}
}

export async function getTodosByTodoListId(todoListId: string) {
	try {
		const todoList = await databases.getDocument(
			appwriteConfig.databaseId,
			appwriteConfig.todoListId,
			todoListId
		);

		// Fetch todos based on the TodoList ID
		const todos = await databases.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.todosId,
			[Query.equal("todoList", todoListId)]
		);

		// Map todos to only include necessary fields
		const formattedTodos = todos.documents.map((todo) => ({
			id: todo.$id,
			task: todo.task,
			completed: todo.completed,
		}));

		return {
			todoListId,
			listName: todoList.name,
			color: todoList.color,
			totalTodos: todos.total,
			completedTodos: formattedTodos.filter((todo) => todo.completed).length,
			todos: formattedTodos,
		};
	} catch (error: any) {
		throw new Error(error);
	}
}

export async function toggleTodoStatus(todoId: string, currentStatus: boolean) {
	try {
		const updatedTodo = await databases.updateDocument(
			appwriteConfig.databaseId,
			appwriteConfig.todosId,
			todoId,
			{
				completed: !currentStatus,
			}
		);

		return { status: true, todoId };
	} catch (error: any) {
		throw new Error(error);
	}
}

export async function addTodoToTodoList(
	todoListId: string,
	task: string,
	completed = false
) {
	try {
		const newTodo = await databases.createDocument(
			appwriteConfig.databaseId,
			appwriteConfig.todosId,
			ID.unique(),
			{
				todoList: todoListId,
				task: task,
				completed: completed,
			}
		);

		return {
			id: newTodo.$id,
			task: newTodo.task,
			completed: newTodo.completed,
			todoListId,
		};
	} catch (error: any) {
		throw new Error(error);
	}
}

export async function deleteTodoList(todoListId: string) {
	try {
		await databases.deleteDocument(
			appwriteConfig.databaseId,
			appwriteConfig.todoListId,
			todoListId
		);

		return true;
	} catch (error: any) {
		throw new Error(error);
	}
}

export async function uploadFile(file: ImagePickerAsset, userId: string) {
	if (!file) return;

	const asset = {
		name: file.fileName || "IMG.HEIC",
		type: file.mimeType || "image",
		size: file.fileSize || 0,
		uri: file.uri,
	};

	try {
		try {
			await storage.deleteFile(appwriteConfig.storageId, userId);
		} catch (error: any) {
			// It's okay if the file doesn't exist, log and continue
			if (error.code !== 404) {
				console.error("Error deleting existing file:", error.message);
			}
		}

		const uploadedFile = await storage.createFile(
			appwriteConfig.storageId,
			userId,
			asset
		);

		const fileUrl = await storage.getFilePreview(
			appwriteConfig.storageId,
			uploadedFile.$id,
			2000,
			2000,
			ImageGravity.Top,
			100
		);

		if (!fileUrl) throw Error;

		const updatedUser = await databases.updateDocument(
			appwriteConfig.databaseId,
			appwriteConfig.userCollectionId,
			userId,
			{
				avatar: fileUrl,
			}
		);

		return updatedUser;
	} catch (error: any) {
		throw new Error(error);
	}
}
