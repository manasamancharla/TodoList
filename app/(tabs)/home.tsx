import {
	Text,
	View,
	TouchableOpacity,
	FlatList,
	Modal,
	KeyboardAvoidingView,
	Alert,
	Dimensions,
	Platform,
	Image,
	TextInput,
	RefreshControl,
	ScrollView,
	Pressable,
} from "react-native";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import { AntDesign, Entypo, Fontisto } from "@expo/vector-icons";

import useApi from "@/hooks/useApi";
import {
	getTodoLists,
	getTodosByTodoListId,
	toggleTodoStatus,
	addTodoToTodoList,
	deleteTodoList,
} from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";
import colors from "@/constants/colors";
import { TodoList, Todo } from "@/types/todoList";
import Loader from "@/components/Loader";

const renderTodo = (
	todo: Todo,
	handleToggleStatus: (todo: Todo) => Promise<void>
) => {
	return (
		<View className="flex-row justify-start items-start mt-1 my-2">
			<TouchableOpacity onPress={() => handleToggleStatus(todo)}>
				<Fontisto
					name={todo.completed ? "checkbox-active" : "checkbox-passive"}
					size={20}
					color={colors.text}
					className="w-8"
				/>
			</TouchableOpacity>

			<Text
				className={`font-bold font-pmedium text-lg ml-2 ${
					todo.completed ? "line-through text-textvariant" : "text-text"
				}`}
			>
				{todo.task}
			</Text>
		</View>
	);
};

const home = () => {
	const {
		user,
		setLastCreatedTodoList,
		lastCreatedTodoList,
		selectedID,
		setSelectedID,
	} = useGlobalContext();

	const { data: lists, refetch } = useApi(() => getTodoLists(user?.$id));

	const [refreshing, setRefreshing] = useState(false);

	const onRefresh = async () => {
		setRefreshing(true);
		await refetch();
		setRefreshing(false);
	};

	const [showList, setShowList] = useState(false);

	const [listData, setListData] = useState<TodoList | null>(null);

	const [newTodo, setNewTodo] = useState("");

	const [isLoading, setIsLoading] = useState(false);

	const handleCloseList = async () => {
		setShowList(!showList);

		setListData(null);
		setLastCreatedTodoList("");
		refetch();
	};

	const handleShowList = async (listID: string) => {
		setShowList(!showList);
		setIsLoading(true);

		if (listID) {
			try {
				const res = await getTodosByTodoListId(listID);
				setListData(res || {});
			} catch (error) {
				console.error("Error fetching todos:", error);
			} finally {
				setIsLoading(false);
			}
		} else {
			setListData(null);
			setIsLoading(false);
		}
	};

	const handleToggleStatus = async (todo: Todo): Promise<void> => {
		try {
			const { status, todoId } = await toggleTodoStatus(
				todo.id,
				todo.completed
			);

			if (status) {
				setListData((prevData) => {
					if (!prevData) return null;

					const updatedTodos = prevData.todos.map((t) =>
						t.id === todoId ? { ...t, completed: !t.completed } : t
					);

					const completedCount = updatedTodos.filter((t) => t.completed).length;

					return {
						...prevData,
						todos: updatedTodos,
						completedTodos: completedCount,
						color: prevData.color,
						listName: prevData.listName,
						todoListId: prevData.todoListId,
						totalTodos: updatedTodos.length,
					};
				});
			} else {
				console.error(`Failed to update status for Todo ${todoId}`);
			}
		} catch (error) {
			console.error("Error toggling todo status:", error);
		}
	};

	const handleAddTodo = async (listID: string) => {
		if (newTodo.trim() === "") {
			Alert.alert("Error", "Please enter a valid task");
			return;
		}

		setNewTodo("");

		try {
			const newTodoData = await addTodoToTodoList(listID, newTodo);

			setListData((prevData) => {
				if (!prevData) return null;

				return {
					...prevData,
					totalTodos: (prevData.totalTodos || 0) + 1,
					todos: [
						...prevData.todos,
						{
							...newTodoData,
						},
					],
				};
			});
		} catch (error: any) {
			console.error("Error adding todo:", error);
			Alert.alert(
				"Error",
				error.message || "Failed to add the task. Please try again."
			);
		}
	};

	const handleDeleteTodoList = async (todoListID: any) => {
		try {
			const res = await deleteTodoList(todoListID);

			handleCloseList();
		} catch (error: any) {
			throw new Error(error);
		}
	};

	useEffect(() => {
		if (lastCreatedTodoList !== "") {
			handleShowList(lastCreatedTodoList);
		}
	}, [lastCreatedTodoList]);

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			className="bg-background h-full"
		>
			<View
				className="w-full flex justify-start h-full px-4 my-6"
				style={{
					minHeight: Dimensions.get("window").height,
				}}
			>
				<Modal
					animationType="slide"
					visible={showList}
					onRequestClose={handleCloseList}
				>
					<KeyboardAvoidingView
						behavior={Platform.OS === "ios" ? "padding" : "height"}
						style={{ flex: 1, marginBottom: 15 }}
						className="bg-background h-full"
					>
						<ScrollView
							contentContainerStyle={{ flexGrow: 1 }}
							keyboardShouldPersistTaps="handled"
						>
							<View
								className="w-full flex justify-start flex-1 px-4 my-6"
								style={{
									minHeight: Dimensions.get("window").height - 100,
								}}
							>
								<View
									className={`w-full flex items-center flex-row justify-between mb-4 border-b-2`}
									style={{ borderBottomColor: listData?.color }}
								>
									<View className={`flex flex-row mb-4 gap-3 items-center`}>
										<TouchableOpacity
											className="rounded-full border-2 justify-center items-center bg-transparent"
											onPress={handleCloseList}
											style={{
												width: 40,
												height: 40,
												borderRadius: 20,
												borderColor: "grey",
											}}
										>
											<AntDesign name="close" size={20} color="white" />
										</TouchableOpacity>

										<View>
											<Text className="text-2xl font-extrabold text-white">
												{listData?.listName}
											</Text>
											<Text className="text-lg mt-1 text-gray-500 font-semibold">
												{listData?.completedTodos} of {listData?.totalTodos}{" "}
												todos
											</Text>
										</View>
									</View>

									{isLoading ? (
										<></>
									) : (
										<TouchableOpacity
											className="justify-center items-center"
											onPress={() => {
												handleDeleteTodoList(selectedID);
											}}
										>
											<AntDesign name="delete" size={20} color="white" />
										</TouchableOpacity>
									)}
								</View>

								{isLoading ? (
									<Loader isLoading={isLoading} isScreenHeight={false} />
								) : (
									<>
										<View className="w-full ml-2 flex-grow">
											<FlatList
												data={listData?.todos}
												keyboardShouldPersistTaps="handled"
												keyExtractor={(item) => item.id}
												scrollEnabled={false}
												renderItem={({ item }) =>
													renderTodo(item, handleToggleStatus)
												}
												contentContainerStyle={{
													flexGrow: 1,
												}}
												showsVerticalScrollIndicator={false}
											/>
										</View>

										<View className="mt-8 px-3 flex flex-row justify-start items-center">
											<TextInput
												className={`flex-1 h-12 border rounded-md px-2 text-text`}
												style={{ borderColor: colors.textVariant }}
												placeholder="Add Task"
												value={newTodo}
												onChangeText={setNewTodo}
												placeholderTextColor={colors.textVariant}
											/>

											<TouchableOpacity
												className="ml-2 h-12 rounded px-4 py-3 w-max"
												style={{
													backgroundColor:
														listData?.color || colors.textVariant,
												}}
												onPress={() => {
													if (listData?.todoListId) {
														handleAddTodo(listData.todoListId);
													} else {
														Alert.alert(
															"Error",
															"Invalid list ID. Cannot add a new task."
														);
													}
												}}
											>
												<AntDesign name="plus" size={16} color="white" />
											</TouchableOpacity>
										</View>
									</>
								)}
							</View>
						</ScrollView>
					</KeyboardAvoidingView>
				</Modal>

				<View className="flex flex-row justify-between">
					<View className="flex-1">
						<Text className="font-pmedium text-text text-lg mt-5 mb-1">
							Hello, {user?.username}
						</Text>

						<Text className="font-pmedium text-text text-xl mt-1 mb-5">
							Your TodoLists ({lists?.todoListCount ? lists?.todoListCount : 0})
						</Text>
					</View>

					<Pressable
						className="flex-1 items-end justify-center"
						onPress={() => {
							router.replace("/profile");
						}}
					>
						<Image
							source={{ uri: user?.avatar }}
							resizeMode="cover"
							style={{
								width: 50,
								height: 50,
								borderRadius: 25,
								borderColor: "white",
							}}
						/>
					</Pressable>
				</View>

				<FlatList
					data={lists?.todoLists}
					keyExtractor={(item) => item.id}
					keyboardShouldPersistTaps="always"
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ paddingBottom: 80 }}
					renderItem={({ item }) => (
						<View
							className="bg-background flex flex-col justify-between m-2 px-4 py-2 rounded-3xl h-80"
							style={{
								backgroundColor: colors.background,
								borderWidth: 1,
								borderColor: "grey",
								borderRadius: 20,
							}}
						>
							<Text
								className="font-pregular mt-2 text-4xl text-text"
								numberOfLines={1}
							>
								{item.name}
							</Text>

							<View>
								<Text className="font-pbold mt-2 text-3xl text-text">
									{item.completedTodosCount}/{item.todoCount}
								</Text>
								<Text className="font-pextralight text-text text-xl">
									Todos
								</Text>
							</View>

							<View className="flex items-end ">
								<TouchableOpacity
									className="rounded-full border-1 justify-center items-center"
									onPress={() => {
										handleShowList(item.id);
										setSelectedID(item.id);
									}}
									style={{
										width: 50,
										height: 50,
										borderRadius: 25,
										borderColor: "transparent",
										backgroundColor: item.color,
									}}
								>
									<Entypo
										name="dots-three-horizontal"
										size={24}
										color="white"
									/>
								</TouchableOpacity>
							</View>
						</View>
					)}
					ListEmptyComponent={() => (
						<View className="flex justify-center items-center px-4 mt-10">
							<Text className="text-sm font-pmedium text-gray-100">
								No TodoLists Found
							</Text>
							<Text className="text-xl text-center font-psemibold text-text mt-2">
								No todolists created yet
							</Text>
						</View>
					)}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
							colors={[
								colors.color1,
								colors.color2,
								colors.color3,
								colors.color4,
							]}
							progressBackgroundColor={colors.background}
						/>
					}
				/>
			</View>
		</KeyboardAvoidingView>
	);
};

export default home;
