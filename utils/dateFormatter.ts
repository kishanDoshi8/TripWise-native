import {
    differenceInCalendarDays,
    format,
    formatDistanceToNow,
} from "date-fns";

export const getDistance = (startDate: Date): string => {
	return formatDistanceToNow(startDate, { addSuffix: true });
};

export const getRange = (startDate: Date, endDate: Date) => {
	const sameDay = startDate.getTime() === endDate.getTime();
	if (sameDay) {
		return format(startDate, "d MMM");
	}
	const sameMonth = startDate.getMonth() === endDate.getMonth();
	const sameYear = startDate.getFullYear() === endDate.getFullYear();

	let range: string;

	if (sameMonth && sameYear) {
		range = `${format(startDate, "d MMM")} – ${format(endDate, "d")}`;
	} else {
		range = `${format(startDate, "d MMM")} – ${format(endDate, "d MMM")}`;
	}

	return range;
};

export const getDuration = (startDate: Date, endDate: Date) => {
	const duration = differenceInCalendarDays(endDate, startDate) + 1;

	return duration;
};
