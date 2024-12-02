import { Alert } from "react-native";
import { useEffect, useState } from "react";

const useApi = <T,>(fn: () => Promise<T>) => {
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState(true);

	const fetchData = async () => {
		setLoading(true);
		try {
			const res = await fn();
			setData(res);
		} catch (error: unknown) {
			if (error instanceof Error) {
				Alert.alert("Error", error.message);
			} else {
				Alert.alert("Error", "An unknown error occurred");
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const refetch = () => fetchData();

	return { data, loading, refetch };
};

export default useApi;
