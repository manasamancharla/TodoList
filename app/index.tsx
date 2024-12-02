import { Redirect } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useEffect } from "react";

export default function App() {
	const { loading, isLogged } = useGlobalContext();

	// While loading is true, don't render anything to avoid premature redirects
	// if (loading) return null;

	// Once loading is complete, redirect based on isLogged state
	return isLogged ? <Redirect href="/home" /> : <Redirect href="/login" />;
}
