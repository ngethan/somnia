import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ActivityIndicator, View, Image } from "react-native";
import * as z from "zod";

import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormInput } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import { H1 } from "@/components/ui/typography";
import { useSupabase } from "@/context/supabase-provider";

// Import the logo
const logo = require("../(app)/somnialogo.png"); // Adjust the path accordingly

// Define form validation schema
const formSchema = z
	.object({
		firstName: z.string().min(1, "First name is required."),
		lastName: z.string().min(1, "Last name is required."),
		phoneNumber: z.string(),
		password: z
			.string()
			.min(8, "Please enter at least 8 characters.")
			.max(64, "Please enter fewer than 64 characters.")
			.regex(
				/^(?=.*[a-z])/,
				"Your password must have at least one lowercase letter.",
			)
			.regex(
				/^(?=.*[A-Z])/,
				"Your password must have at least one uppercase letter.",
			)
			.regex(/^(?=.*[0-9])/, "Your password must have at least one number.")
			.regex(
				/^(?=.*[!@#$%^&*])/,
				"Your password must have at least one special character.",
			),
		confirmPassword: z.string().min(8, "Please enter at least 8 characters."),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Your passwords do not match.",
		path: ["confirmPassword"],
	});

export default function SignUp() {
	const { signUp } = useSupabase();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			phoneNumber: "",
			password: "",
			confirmPassword: "",
		},
	});

	async function onSubmit(data: z.infer<typeof formSchema>) {
		try {
			await signUp(
				data.firstName,
				data.lastName,
				data.phoneNumber,
				data.password,
			);

			form.reset();
		} catch (error: Error | any) {
			console.log(error.message);
		}
	}

	return (
		<SafeAreaView className="flex-1 bg-purple-50 p-4" edges={["bottom"]}>
			<View className="flex-1 items-center justify-center gap-4 web:m-4">
				{/* Logo */}
				{/*<Image source={logo} style={{ width: 150, height: 150 }} />*/}

				{/* Title */}
				<H1 className="self-center text-purple-700">Create an Account</H1>

				{/* Form */}
				<Form {...form}>
					<View className="gap-4">
						<FormField
							control={form.control}
							name="firstName"
							render={({ field }) => (
								<FormInput
									label="First Name"
									placeholder="First Name"
									autoCapitalize="words"
									autoCorrect={false}
									className="text-purple-700 border-purple-300"
									{...field}
								/>
							)}
						/>
						<FormField
							control={form.control}
							name="lastName"
							render={({ field }) => (
								<FormInput
									label="Last Name"
									placeholder="Last Name"
									autoCapitalize="words"
									autoCorrect={false}
									className="text-purple-700 border-purple-300"
									{...field}
								/>
							)}
						/>
						<FormField
							control={form.control}
							name="phoneNumber"
							render={({ field }) => (
								<FormInput
									label="Phone Number"
									placeholder="Phone Number"
									autoCapitalize="none"
									autoComplete="tel-national"
									autoCorrect={false}
									keyboardType="phone-pad"
									className="text-purple-700 border-purple-300"
									{...field}
								/>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormInput
									label="Password"
									placeholder="Password"
									autoCapitalize="none"
									autoCorrect={false}
									secureTextEntry
									className="text-purple-700 border-purple-300"
									{...field}
								/>
							)}
						/>
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormInput
									label="Confirm Password"
									placeholder="Confirm password"
									autoCapitalize="none"
									autoCorrect={false}
									secureTextEntry
									className="text-purple-700 border-purple-300"
									{...field}
								/>
							)}
						/>
					</View>
				</Form>
			</View>

			{/* Sign-Up Button */}
			<Button
				size="default"
				variant="default"
				onPress={form.handleSubmit(onSubmit)}
				disabled={form.formState.isSubmitting}
				className="web:m-4 bg-purple-700"
			>
				{form.formState.isSubmitting ? (
					<ActivityIndicator size="small" color="#FFF" />
				) : (
					<Text className="text-white">Sign Up</Text>
				)}
			</Button>
		</SafeAreaView>
	);
}
