import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { ActivityIndicator, View } from "react-native";
import * as z from "zod";

import { SafeAreaView } from "@/components/safe-area-view";
import { useSupabase } from "@/context/supabase-provider";
import { Button, Layout, Input, Text } from "@ui-kitten/components";

// Zod schema for form validation
const formSchema = z.object({
	phoneNumber: z.string().min(1, "Phone Number is required."),
	password: z.string().min(8, "Password must be at least 8 characters."),
});

export default function SignIn() {
	const { signInWithPassword } = useSupabase();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			phoneNumber: "",
			password: "",
		},
	});

	async function onSubmit(data: z.infer<typeof formSchema>) {
		try {
			await signInWithPassword(data.phoneNumber, data.password);
			form.reset();
		} catch (error: Error | any) {
			console.log(error.message);
		}
	}

	return (
		<SafeAreaView
			style={{
				flex: 1,
				justifyContent: "center",
				padding: 20,
				backgroundColor: "#FAF5FF",
			}}
		>
			<Layout style={{ alignItems: "center", backgroundColor: "transparent" }}>
				<Text
					category="h1"
					style={{
						marginBottom: 16,
						color: "#8E44AD",
						textAlign: "center",
					}}
				>
					Sign In
				</Text>

				{/* Form Fields */}
				<Layout style={{ width: "100%", backgroundColor: "transparent" }}>
					{/* Phone Number Field */}
					<View style={{ marginBottom: 16 }}>
						<Controller
							control={form.control}
							name="phoneNumber"
							render={({
								field: { onChange, onBlur, value },
								fieldState: { error },
							}) => (
								<>
									<Input
										label="Phone Number"
										placeholder="Phone Number"
										status={error ? "danger" : "primary"}
										size="large"
										value={value}
										onBlur={onBlur}
										onChangeText={onChange}
										textStyle={{ color: "black" }} // Set text color to black
										style={{
											borderColor: error ? "red" : "#8E44AD",
											backgroundColor: "transparent",
										}}
									/>
									{error && (
										<Text style={{ color: "red", marginTop: 4 }}>
											{error.message}
										</Text>
									)}
								</>
							)}
						/>
					</View>

					{/* Password Field */}
					<View style={{ marginBottom: 16 }}>
						<Controller
							control={form.control}
							name="password"
							render={({
								field: { onChange, onBlur, value },
								fieldState: { error },
							}) => (
								<>
									<Input
										label="Password"
										placeholder="Password"
										status={error ? "danger" : "primary"}
										size="large"
										secureTextEntry={true}
										value={value}
										onBlur={onBlur}
										onChangeText={onChange}
										textStyle={{ color: "black" }} // Set text color to black
										style={{
											borderColor: error ? "red" : "#8E44AD",
											backgroundColor: "transparent",
										}}
									/>
									{error && (
										<Text style={{ color: "red", marginTop: 4 }}>
											{error.message}
										</Text>
									)}
								</>
							)}
						/>
					</View>
				</Layout>

				{/* Sign-In Button */}
				<Button
					style={{
						marginBottom: 16,
						width: "100%",
						backgroundColor: "#8E44AD",
					}}
					status="primary"
					size="large"
					onPress={form.handleSubmit(onSubmit)}
					disabled={form.formState.isSubmitting}
				>
					{form.formState.isSubmitting ? (
						<ActivityIndicator size="small" color="white" />
					) : (
						<Text>Sign In</Text>
					)}
				</Button>
			</Layout>
		</SafeAreaView>
	);
}
