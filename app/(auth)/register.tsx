import { useState } from "react";
import { ScrollView, View, Text, Dimensions, Alert } from "react-native";
import { router, Link } from "expo-router";

import Button from "@/components/Button";
import InputField from "@/components/InputField";
import { createUser } from "@/lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

export default function Register() {
	const [isSubmitting, setSubmitting] = useState(false);
	const [form, setForm] = useState({
		username: "",
		email: "",
		password: "",
	});

	const { setUser, setIsLogged } = useGlobalContext();

	const register = async () => {
		if (form.username === "" || form.email === "" || form.password === "") {
			Alert.alert("Error", "Please fill in all fields");
		}

		setSubmitting(true);
		try {
			const result = await createUser(form.email, form.password, form.username);
			setUser(result);
			setIsLogged(true);

			router.replace("/home");
		} catch (error: any) {
			Alert.alert("Error", error.message);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<ScrollView className="bg-background h-full">
			<View
				className="w-full flex justify-center h-full px-4 my-6"
				style={{
					minHeight: Dimensions.get("window").height - 100,
				}}
			>
				<View className="w-full flex justify-center items-center h-full px-4">
					<View className="flex-row">
						<View className="bg-text h-[1px] flex-1 self-center"></View>
						<Text className="text-[38px] font-pextrabold text-text  px-16">
							TodoList
						</Text>
						<View className="bg-text  h-[1px] flex-1 self-center"></View>
					</View>

					<Text className="text-xl text-text mt-10 font-psemibold">
						Get Started!
					</Text>

					<InputField
						title="Email"
						value={form.email}
						handleChangeText={(e) => setForm({ ...form, email: e })}
						keyboardType="email-address"
						placeholder=""
					/>

					<InputField
						title="Username"
						value={form.username}
						handleChangeText={(e) => setForm({ ...form, username: e })}
						placeholder=""
						containerStyles="mt-7"
					/>

					<InputField
						title="Password"
						value={form.password}
						handleChangeText={(e) => setForm({ ...form, password: e })}
						placeholder=""
						containerStyles="mt-7"
						isPassword={true}
					/>

					<Button
						containerStyles={"p-2 mt-5"}
						handlePress={register}
						isLoading={isSubmitting}
					>
						<Text className="text-text font-psemibold text-lg mr-1">
							{isSubmitting ? "Registering" : "Register"}
						</Text>
					</Button>

					<View className="flex justify-center mt-5 flex-row gap-2">
						<Text className="text-lg text-gray-100 font-pregular">
							Already have an account?
						</Text>
						<Link href="/login" className="text-lg font-psemibold text-color1">
							Login
						</Link>
					</View>
				</View>
			</View>
		</ScrollView>
	);
}
