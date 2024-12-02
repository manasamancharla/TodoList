import {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from "react";

import { getCurrentUser } from "@/lib/appwrite";

type GlobalContextType = {
	isLogged: boolean;
	setIsLogged: (value: boolean) => void;
	user: any | null;
	setUser: (value: any | null) => void;
	loading: boolean;
	lastCreatedTodoList: string;
	setLastCreatedTodoList: (value: string) => void;
	selectedID: string;
	setSelectedID: (value: string) => void;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);
// export const useGlobalContext = () => useContext(GlobalContext);

export const useGlobalContext = (): GlobalContextType => {
	const context = useContext(GlobalContext);
	if (!context) {
		throw new Error("useGlobalContext must be used within a GlobalProvider");
	}
	return context;
};

const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [isLogged, setIsLogged] = useState(false);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [lastCreatedTodoList, setLastCreatedTodoList] = useState<string>("");
	const [selectedID, setSelectedID] = useState<string>("");

	useEffect(() => {
		getCurrentUser()
			.then((res: any | null) => {
				if (res) {
					setIsLogged(true);
					setUser(res);
				} else {
					setIsLogged(false);
					setUser(null);
				}
			})
			.catch((error) => {
				throw new Error(error);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	return (
		<GlobalContext.Provider
			value={{
				isLogged,
				setIsLogged,
				user,
				setUser,
				loading,
				lastCreatedTodoList,
				setLastCreatedTodoList,
				setSelectedID,
				selectedID,
			}}
		>
			{children}
		</GlobalContext.Provider>
	);
};

export default GlobalProvider;
