import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ActivityIndicator, View } from "react-native";
import * as z from "zod";

import { SafeAreaView } from "@/components/safe-area-view";

import { Form, FormField, FormInput } from "@/components/ui/form";

import { H1 } from "@/components/ui/typography";
import { useSupabase } from "@/context/supabase-provider";
import { Button, Layout, Input, Text } from '@ui-kitten/components';

const formSchema = z.object({
	firstName: z.string().min(1, "First name is required."),
	lastName: z.string().min(1, "Last name is required."),
	phoneNumber: z.string(),
	password: z.string().min(8, "Please enter at least 8 characters."),
	confirmPassword: z.string().min(8, "Please enter at least 8 characters."),
}).refine((data) => data.password === data.confirmPassword, {
	message: "Passwords don't match",
	path: ["confirmPassword"],
});

export default function SignUp() {
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
			await signUp(data.firstName, data.lastName, data.phoneNumber, data.password);
			form.reset();
		} catch (error: Error | any) {
			console.log(error.message);
		}
	}

	return (
		<SafeAreaView style={{ flex: 1, padding: 24, backgroundColor: '#FAF5FF' }}>
			<Text
				category="h1"
				style={{
					marginBottom: 16,
					textAlign: 'center',
					color: '#8E44AD', // Purple color
				}}
			>
				Create an Account
			</Text>

			{/* Form Fields */}
			<Layout style={{ width: '100%', backgroundColor: 'transparent' }}>
			<Input
  label="First Name"
  placeholder="First Name"
  status="basic"
  style={{
    marginBottom: 16,
    borderRadius: 8,
    borderColor: '#8E44AD', // Purple border
    backgroundColor: 'transparent', // Transparent background
  }}
/>
<Input
  label="Last Name"
  placeholder="Last Name"
  status="basic"
  style={{
    marginBottom: 16,
    borderRadius: 8,
    borderColor: '#8E44AD', // Purple border
    backgroundColor: 'transparent', // Transparent background
  }}
/>
<Input
  label="Phone Number"
  placeholder="Phone Number"
  status="basic"
  style={{
    marginBottom: 16,
    borderRadius: 8,
    borderColor: '#8E44AD', // Purple border
    backgroundColor: 'transparent', // Transparent background
  }}
/>
<Input
  label="Password"
  placeholder="Password"
  secureTextEntry={true}
  status="basic"
  style={{
    marginBottom: 16,
    borderRadius: 8,
    borderColor: '#8E44AD', // Purple border
    backgroundColor: 'transparent', // Transparent background
  }}
/>
<Input
  label="Confirm Password"
  placeholder="Confirm Password"
  secureTextEntry={true}
  status="basic"
  style={{
    marginBottom: 16,
    borderRadius: 8,
    borderColor: '#8E44AD', // Purple border
    backgroundColor: 'transparent', // Transparent background
  }}
/>
			</Layout>

			{/* Sign-Up Button */}
			<Button
				style={{
					marginBottom: 24,
					backgroundColor: '#8E44AD',
					padding: 12,
				}}
				onPress={form.handleSubmit(onSubmit)}
			>
				Sign Up
			</Button>
		</SafeAreaView>
	);
}
