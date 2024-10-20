import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ActivityIndicator, View } from "react-native";
import * as z from "zod";

import { SafeAreaView } from "@/components/safe-area-view";
import { Form, FormField, FormInput } from "@/components/ui/form";
import { H1 } from "@/components/ui/typography";
import { useSupabase } from "@/context/supabase-provider";
import { Button, Layout, Input, Text } from '@ui-kitten/components';

// Zod schema for form validation
const formSchema = z.object({
  phoneNumber: z.string().min(1, "Phone Number is required."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export default function SignIn() {
	return (
		<SafeAreaView style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#FAF5FF' }}>
			<Layout style={{ alignItems: 'center', backgroundColor: 'transparent' }}>
				<Text
					category="h1"
					style={{
						marginBottom: 16,
						color: '#8E44AD',
						textAlign: 'center',
					}}
				>
					Sign In
				</Text>

				{/* Form Fields */}
				<Layout style={{ width: '100%', backgroundColor: 'transparent' }}>
					<Input
						label="Phone Number"
						placeholder="Phone Number"
						status="primary"
						size="large"
						style={{
							marginBottom: 16,
							borderColor: '#8E44AD', // Purple border
							backgroundColor: 'transparent', // Transparent background
						}}
					/>
					<Input
						label="Password"
						placeholder="Password"
						status="primary"
						size="large"
						secureTextEntry={true}
						style={{
							marginBottom: 16,
							borderColor: '#8E44AD', // Purple border
							backgroundColor: 'transparent', // Transparent background
						}}
					/>
				</Layout>

				{/* Sign-In Button */}
				<Button
					style={{
						marginBottom: 16,
						width: '100%',
						backgroundColor: '#8E44AD', // Purple background
					}}
					status="primary"
					size="large"
				>
					Sign In
				</Button>
			</Layout>
		</SafeAreaView>
	);
}
