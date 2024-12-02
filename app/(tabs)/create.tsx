import {
	Text,
	View,
	TouchableOpacity,
	KeyboardAvoidingView,
	ScrollView,
	Dimensions,
	Platform,
	Alert,
} from "react-native";
import { Entypo, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { router } from "expo-router";

import InputField from "@/components/InputField";
import Button from "@/components/Button";
import colors from "@/constants/colors";
import { createTodoList } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";

const create = () => {
	const [name, setName] = useState("");
	const [isSubmitting, setSubmitting] = useState(false);
	const [selectedColor, setColor] = useState<string>(colors.color1);
	const { user, setLastCreatedTodoList, setSelectedID } = useGlobalContext();

	const iconData = [
		{
			color: colors.color4,
			icon: <Entypo name="graduation-cap" size={20} color={colors.color4} />,
		},
		{
			color: colors.color2,
			icon: <FontAwesome5 name="shuttle-van" size={20} color={colors.color2} />,
		},
		{
			color: colors.color1,
			icon: (
				<MaterialIcons name="business-center" size={20} color={colors.color1} />
			),
		},
		{
			color: colors.color3,
			icon: (
				<FontAwesome5 name="shopping-cart" size={20} color={colors.color3} />
			),
		},
	];

	const create = async () => {
		if (name === "") {
			Alert.alert("Error", "Please fill in all fields");
		}

		setSubmitting(true);

		try {
			const result = await createTodoList(user?.$id, name, selectedColor);

			setLastCreatedTodoList(result.$id);
			setSelectedID(result.$id);

			router.replace("/home");
		} catch (error: any) {
			Alert.alert("Error", error.message);
		} finally {
			setSubmitting(false);
			setName("");
		}
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		>
			<ScrollView className="bg-background h-full">
				<View
					className="w-full flex justify-start h-full px-4 my-6"
					style={{
						minHeight: Dimensions.get("window").height - 100,
					}}
				>
					<View className="w-full flex justify-center items-center h-full px-4">
						<View>
							<Text className="font-pbold mb-2 text-4xl text-text">
								TodoList
							</Text>
						</View>

						<InputField
							title="Title"
							value={name}
							handleChangeText={(e) => setName(e)}
							placeholder=""
							borderColor={selectedColor}
						/>

						<View className="justify-center items-center bg-transparent">
							<View className="flex-row justify-between mt-4 w-4/5">
								{iconData.map((icon, index) => (
									<TouchableOpacity
										key={index}
										className={`w-14 h-14 rounded-full items-center justify-center border ${
											selectedColor === icon.color ? "border-2" : "border"
										}`}
										style={{
											width: 40,
											height: 40,
											borderRadius: 20,
											borderColor: icon.color,
										}}
										onPress={() => setColor(icon?.color)}
									>
										{icon.icon}
									</TouchableOpacity>
								))}
							</View>
						</View>

						<Button
							containerStyles={"p-2 mt-5"}
							backgroundColor={selectedColor}
							handlePress={create}
							isLoading={isSubmitting}
						>
							<Text className="text-text font-psemibold text-lg mr-1">
								Create
							</Text>
						</Button>
					</View>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

export default create;
