import "../global.css";

import * as eva from "@eva-design/eva";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { Slot } from "expo-router";

import { SupabaseProvider } from "@/context/supabase-provider";

export default function AppLayout() {
	return (
		<SupabaseProvider>
			<IconRegistry icons={EvaIconsPack} />
			<ApplicationProvider {...eva} theme={eva.dark}>
				<Slot />
			</ApplicationProvider>
		</SupabaseProvider>
	);
}
