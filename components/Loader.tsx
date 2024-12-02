import { View, ActivityIndicator, Dimensions, Platform } from "react-native";

type LoaderProps = {
	isLoading: boolean;
	isScreenHeight: boolean;
};

const Loader: React.FC<LoaderProps> = ({ isLoading, isScreenHeight }) => {
	const screenHeight = Dimensions.get("screen").height;

	if (!isLoading) return null;

	return (
		<View
			className="absolute flex justify-center items-center w-full h-full bg-primary/60 z-10"
			style={{
				height: isScreenHeight ? screenHeight : "100%",
			}}
		>
			<ActivityIndicator
				animating={isLoading}
				color="#fff"
				size={Platform.OS === "ios" ? "large" : 50}
			/>
		</View>
	);
};

export default Loader;
