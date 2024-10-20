import { SleepCycle } from "@/database/schema"

export interface SleepData {
    id: string;
    userId: string;
    date: Date;
    sleepDuration: number;
    sleepCycle: SleepCycle[];
    sleepQuality: number;
    suggestions: string;
}

export interface User { 
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    phoneNumber: string;
}