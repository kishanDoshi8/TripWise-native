import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { IconProps } from '@expo/vector-icons/build/createIconSet';
import React from 'react';

export const ICONS = {
	logo: createIcon(MaterialIcons, 'hiking'),
  	back: createIcon(MaterialIcons, 'arrow-back'),
	home: createIcon(AntDesign, 'home'),
	invite: createIcon(Ionicons, 'paper-plane-outline'),
	addCircle: createIcon(AntDesign, 'pluscircleo'),
	add: createIcon(MaterialIcons, 'add'),
	recent: createIcon(MaterialIcons, 'history'),
	more: createIcon(MaterialIcons, 'more-horiz'),
	search: createIcon(MaterialIcons, 'search'),
	location: createIcon(MaterialIcons, 'location-pin'),
	calendar: createIcon(MaterialIcons, 'calendar-month'),
	check: createIcon(MaterialIcons, 'check'),
	close: createIcon(MaterialIcons, 'close'),
	dot: createIcon(MaterialIcons, 'fiber-manual-record'),
	role: createIcon(MaterialIcons, 'assignment-ind'),
	copy: createIcon(MaterialIcons, 'content-copy'),
	chevronRight: createIcon(MaterialIcons, 'chevron-right'),
	edit: createIcon(MaterialIcons, 'edit'),
};


type IconFactory = (size?: number, color?: string) => React.ReactElement;

function createIcon(
	IconComponent: React.ComponentType<IconProps<any>>,
	name: string
): IconFactory {
	return (size = 18, color?: string) =>
		React.createElement(IconComponent, {
			name,
			size,
			...(color ? { color } : {}),
		});
}