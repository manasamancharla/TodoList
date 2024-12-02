import {
	View,
	Text,
	KeyboardAvoidingView,
	ScrollView,
	Platform,
	Dimensions,
	Image,
	TouchableOpacity,
	Alert,
	ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import * as ImagePicker from "expo-image-picker";
import { ImagePickerAsset } from "expo-image-picker";

import { useGlobalContext } from "@/context/GlobalProvider";
import { signOut, uploadFile } from "@/lib/appwrite";
import Button from "@/components/Button";
import { icons } from "@/constants";
import colors from "@/constants/colors";

const profile = () => {
	const { user, setUser, setIsLogged } = useGlobalContext();
	const [isSubmitting, setSubmitting] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const pickImage = async () => {
		try {
			// No permissions request is necessary for launching the image library
			let result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ["images"],
				allowsEditing: true,
				aspect: [4, 3],
				quality: 0.5,
			});

			setIsLoading(true);

			if (!result.canceled) {
				const asset: ImagePickerAsset = result.assets[0];
				const updatedUser = await uploadFile(asset, user?.$id);
				if (updatedUser?.avatar) {
					setUser((prevUser: any | null) => ({
						...prevUser,
						avatar: result.assets[0].uri,
					}));

					setIsLoading(false);

					Alert.alert("Success", "Avatar updated!");
				}
			}
		} catch (error: any) {
			console.error("Error picking image:", error.message);
			Alert.alert("Error", "Failed to update avatar. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const logout = async () => {
		setSubmitting(true);
		await signOut();
		setUser(null);
		setIsLogged(false);
		setSubmitting(false);

		router.replace("/login");
	};
	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			className="bg-background h-full"
		>
			<ScrollView>
				<View
					className="w-full flex justify-start h-full px-4 my-6"
					style={{
						minHeight: Dimensions.get("window").height - 100,
					}}
				>
					<View className="flex-1 flex justify-center items-center">
						<Image
							source={{ uri: user?.avatar }}
							resizeMode="cover"
							className="w-28 h-28 rounded-full"
						/>
						<Text className="text-text mt-1 text-lg font-pmedium">
							{user?.username}
						</Text>
						<Text className="text-textvariant text-sm mt-1 font-pregular">
							{user?.email}
						</Text>
					</View>

					<View className="flex-1">
						<View className="flex flex-col">
							<TouchableOpacity
								className="w-full flex flex-row justify-start items-center p-4"
								onPress={pickImage}
							>
								<FontAwesome6
									name="image-portrait"
									size={20}
									color={colors.textVariant}
									className="mr-2"
								/>
								<View>
									<Text className="text-text font-psemibold text-lg">
										Change Avatar
									</Text>

									<Text className="text-textvariant font-plight text-xs">
										Change your profile image.
									</Text>
								</View>
								<View className="flex-grow"></View>
								{isLoading && (
									<ActivityIndicator
										animating={isLoading}
										color="#fff"
										size="small"
										className="ml-2"
									/>
								)}
							</TouchableOpacity>
							<View className="w-full h-[1px] bg-textvariant my-2" />
						</View>
					</View>

					<View className="flex-1 flex justify-center items-center">
						<Button
							containerStyles={"mt-5 max-w-max"}
							handlePress={logout}
							isLoading={isSubmitting}
							backgroundColor="transparent"
							fullWidth={false}
						>
							<Image
								source={icons.logout}
								resizeMode="contain"
								className="w-6 h-6 mr-2"
								tintColor={colors.color1}
							/>
							<Text className="text-color1 font-psemibold text-lg mr-1">
								Logout
							</Text>
						</Button>
						<Text className="text-textvariant font-plight text-xs">
							TodoList v1.0.0
						</Text>
					</View>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

export default profile;
