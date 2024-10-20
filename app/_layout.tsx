import "../global.css";

import * as eva from "@eva-design/eva";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { Slot } from "expo-router";

import { SupabaseProvider } from "@/context/supabase-provider";
import { LogBox } from "react-native";

export default function AppLayout() {
	LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
	LogBox.ignoreAllLogs();

	return (
		<SupabaseProvider>
			<IconRegistry icons={EvaIconsPack} />
			<ApplicationProvider {...eva} theme={eva.dark}>
				<Slot />
			</ApplicationProvider>
		</SupabaseProvider>
	);
}
