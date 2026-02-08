import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { IconProps } from "@expo/vector-icons/build/createIconSet";
import React from "react";

export const ICONS = {
	logo: createIcon(MaterialIcons, "hiking"),
	back: createIcon(MaterialIcons, "arrow-back"),
	home: createIcon(MaterialIcons, "home"),
	invite: createIcon(Ionicons, "paper-plane-outline"),
	addCircle: createIcon(AntDesign, "pluscircleo"),
	add: createIcon(MaterialIcons, "add"),
	recent: createIcon(MaterialIcons, "history"),
	more: createIcon(MaterialIcons, "more-horiz"),
	search: createIcon(MaterialIcons, "search"),
	location: createIcon(MaterialIcons, "location-pin"),
	calendar: createIcon(MaterialIcons, "calendar-month"),
	check: createIcon(MaterialIcons, "check"),
	close: createIcon(MaterialIcons, "close"),
	dot: createIcon(MaterialIcons, "fiber-manual-record"),
	role: createIcon(MaterialIcons, "assignment-ind"),
	copy: createIcon(MaterialIcons, "content-copy"),
	chevronRight: createIcon(MaterialIcons, "chevron-right"),
	chevronLeft: createIcon(MaterialIcons, "chevron-left"),
	chevronDown: createIcon(MaterialIcons, "keyboard-arrow-down"),
	arrowDown: createIcon(MaterialIcons, "arrow-drop-down"),
	edit: createIcon(MaterialIcons, "edit"),
	settings: createIcon(MaterialIcons, "settings"),
	options: createIcon(AntDesign, "ellipsis"),
	notes: createIcon(MaterialIcons, "notes"),
	delete: createIcon(MaterialIcons, "delete"),
	remove: createIcon(MaterialIcons, "remove"),
	groups: createIcon(MaterialIcons, "groups"),
	person: createIcon(MaterialIcons, "person"),
	money: createIcon(MaterialIcons, "attach-money"),
	list: createIcon(MaterialIcons, "checklist"),
	listAlt: createIcon(MaterialIcons, "list-alt"),
	restore: createIcon(MaterialIcons, "restore"),
	markEmailRead: createIcon(MaterialIcons, "mark-email-read"),
	postAdd: createIcon(MaterialIcons, "post-add"),
	errorOutline: createIcon(MaterialIcons, "error-outline"),
};

type IconFactory = (size?: number, color?: string) => React.ReactElement;

function createIcon(
	IconComponent: React.ComponentType<IconProps<any>>,
	name: string,
): IconFactory {
	return (size = 18, color?: string) =>
		React.createElement(IconComponent, {
			name,
			size,
			...(color ? { color } : {}),
		});
}
