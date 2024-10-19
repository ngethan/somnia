import { AppleHealthKit, HealthValue } from "react-native-health";

export function GET(request: Request) {
    const data = AppleHealthKit.getSleepSamples(options, (err: Object, results: Array<HealthValue>) => {
        if (err) {
          return;
        }
        console.log(results).
      });

	return Response.json({ hello: "world" });
}
