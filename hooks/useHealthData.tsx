import { useEffect, useState } from "react";
import { Platform } from "react-native";
import AppleHealthKit, {
	HealthInputOptions,
	HealthKitPermissions,
	HealthValue,
} from "react-native-health";

const permissions: HealthKitPermissions = {
	permissions: {
		read: [
			AppleHealthKit.Constants.Permissions.SleepAnalysis,
			AppleHealthKit.Constants.Permissions.RestingHeartRate,
			AppleHealthKit.Constants.Permissions.RespiratoryRate,
		],
		write: [],
	},
};

const useHealthData = (options: HealthInputOptions) => {
	const [hasPermissions, setHasPermission] = useState(false);
	const [sleepData, setSleepData] = useState<HealthValue[]>([]);
	const [restingHeartRateSamples, setRestingHeartRateSamples] = useState<
		HealthValue[]
	>([]);
	const [respiratoryRateSamples, setRespiratoryRateSamples] = useState<
		HealthValue[]
	>([]);

	useEffect(() => {
		if (Platform.OS !== "ios") {
			return;
		}

		AppleHealthKit.isAvailable((err, isAvailable) => {
			if (err) {
				console.log("Error checking availability");
				return;
			}
			if (!isAvailable) {
				console.log("Apple Health not available");
				return;
			}
			AppleHealthKit.initHealthKit(permissions, (err) => {
				if (err) {
					console.log("Error getting permissions");
					return;
				}
				setHasPermission(true);
			});
		});
	}, []);

	useEffect(() => {
		if (!hasPermissions) {
			return;
		}

		AppleHealthKit.getSleepSamples(options, (err, results) => {
			if (err) {
				console.log("Error getting the sleep samples:", err);
				return;
			}
			setSleepData(results);
		});

		AppleHealthKit.getRestingHeartRateSamples(options, (err, results) => {
			if (err) {
				console.log("Error getting the resting heart rate samples:", err);
				return;
			}
			setRestingHeartRateSamples(results);
		});

		AppleHealthKit.getRespiratoryRateSamples(options, (err, results) => {
			if (err) {
				console.log("Error getting the respiratory rate samples:", err);
				return;
			}
			setRespiratoryRateSamples(results);
		});
	}, [hasPermissions, options]);

	return {
		sleepData,
		restingHeartRateSamples,
		respiratoryRateSamples,
	};
};

export default useHealthData;
