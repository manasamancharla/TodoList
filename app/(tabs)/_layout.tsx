import { View, Text, Image, ImageSourcePropType } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

import { icons } from "../../constants";
import colors from "@/constants/colors";

type TabIconProps = {
	icon?: ImageSourcePropType | undefined;
	iconName?: keyof typeof FontAwesome.glyphMap;
	color: string;
	name: string;
	focused: boolean;
};

const TabIcon: React.FC<TabIconProps> = ({
	icon,
	iconName,
	color,
	name,
	focused,
}) => {
	return (
		<View className="flex items-center justify-center gap-1 mt-4 ">
			{icon ? (
				<Image
					source={icon}
					resizeMode="contain"
					style={{ width: 22, height: 22, tintColor: color }}
				/>
			) : (
				<FontAwesome size={22} name={iconName} color={color} />
			)}
			<Text
				className={`${focused ? "font-psemibold" : "font-pregular"} text-[8px]`}
				style={{ color: color }}
			>
				{name}
			</Text>
		</View>
	);
};

const TabLayout = () => {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: colors.color2,
				tabBarInactiveTintColor: colors.textVariant,
				tabBarShowLabel: false,
				tabBarStyle: {
					borderTopWidth: 0,
					height: 60,
					backgroundColor: colors.backgroundVariant,
				},
			}}
		>
			<Tabs.Screen
				name="home"
				options={{
					title: "Home",
					headerShown: false,
					tabBarIcon: ({ color, focused }) => (
						<TabIcon
							icon={undefined}
							iconName={"list-alt"}
							color={color}
							name="Home"
							focused={focused}
						/>
					),
				}}
			/>

			<Tabs.Screen
				name="create"
				options={{
					title: "Create",
					headerShown: false,
					tabBarIcon: ({ color, focused }) => (
						<TabIcon
							icon={undefined}
							iconName={"plus-circle"}
							color={color}
							name="Create"
							focused={focused}
						/>
					),
				}}
			/>

			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					headerShown: false,
					tabBarIcon: ({ color, focused }) => (
						<TabIcon
							icon={icons.profile}
							color={color}
							name="Profile"
							focused={focused}
						/>
					),
				}}
			/>
		</Tabs>
	);
};

export default TabLayout;
