import colors from "@/constants/colors";
import React, { ReactNode } from "react";
import {
	ActivityIndicator,
	GestureResponderEvent,
	TouchableOpacity,
} from "react-native";

type ButtonProps = {
	handlePress: (event: GestureResponderEvent) => void;
	containerStyles?: string;
	isLoading: boolean;
	backgroundColor?: string;
	fullWidth?: boolean;
	children: ReactNode;
};

const Button: React.FC<ButtonProps> = ({
	handlePress,
	containerStyles,
	isLoading,
	backgroundColor = colors.color1,
	fullWidth = true,
	children,
}) => {
	return (
		<TouchableOpacity
			onPress={handlePress}
			activeOpacity={0.7}
			className={` ${
				fullWidth ? "w-full" : ""
			} rounded-xl min-h-[60px] max-w-96 flex flex-row justify-center items-center ${containerStyles} ${
				isLoading ? "opacity-50" : ""
			}`}
			style={{
				backgroundColor,
			}}
			disabled={isLoading}
		>
			{children}

			{isLoading && (
				<ActivityIndicator
					animating={isLoading}
					color="#fff"
					size="small"
					className="ml-2"
				/>
			)}
		</TouchableOpacity>
	);
};

export default Button;
