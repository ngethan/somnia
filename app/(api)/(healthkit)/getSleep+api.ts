import AppleHealthKit, {
	HealthValue,
	HealthKitPermissions,
} from "react-native-health";

export function GET(request: Request) {
	let options = {
		startDate: new Date(2021, 0, 0).toISOString(), // required
		endDate: new Date().toISOString(), // optional; default now
		limit: 10, // optional; default no limit
		ascending: true, // optional; default false
	};

	const permissions = {
		permissions: {
			read: [AppleHealthKit.Constants.Permissions.HeartRate],
			write: [AppleHealthKit.Constants.Permissions.Steps],
		},
	} as HealthKitPermissions;

	AppleHealthKit.initHealthKit(permissions, (error: string) => {
		if (error) {
			console.log("[ERROR] Cannot grant permissions!");
		}

		const data = AppleHealthKit.getSleepSamples(
			options,
			(err: string, results: Array<HealthValue>) => {
				if (err) {
					return;
				}
				console.log(results);
			},
		);

		return Response.json(data);
	});
}
