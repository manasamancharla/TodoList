import { useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Image,
	TextInputProps,
} from "react-native";

import { icons } from "../constants";
import colors from "@/constants/colors";

type InputFieldProps = TextInputProps & {
	title: string;
	containerStyles?: string;
	value: string;
	placeholder: string;
	handleChangeText: (text: string) => void;
	isPassword?: boolean;
	borderColor?: string;
};
const InputField: React.FC<InputFieldProps> = ({
	title,
	containerStyles,
	value,
	placeholder,
	handleChangeText,
	isPassword = false,
	borderColor = colors.color1,
	...props
}) => {
	const [showPassword, setShowPassword] = useState(false);
	const [isFocused, setIsFocused] = useState(false);

	return (
		<View className={`space-y-2 bg-white-300 max-w-96 ${containerStyles}`}>
			<Text className="text-base text-gray-300 font-pmedium pl-1">{title}</Text>
			<View
				className={`w-full h-16 px-4 rounded-2xl flex flex-row items-center border-2`}
				style={{
					borderColor: isFocused ? borderColor : colors.textVariant,
				}}
			>
				<TextInput
					className="flex-1 text-text font-psemibold text-base"
					value={value}
					placeholder={placeholder}
					placeholderTextColor={colors.textVariant}
					onChangeText={handleChangeText}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					secureTextEntry={title === "Password" && !showPassword}
					{...props}
				/>

				{isPassword && (
					<TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
						<Image
							source={!showPassword ? icons.eye : icons.eyeHide}
							className="w-6 h-6"
							resizeMode="contain"
						/>
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
};

export default InputField;
