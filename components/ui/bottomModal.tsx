import { COLORS } from "@/constants/colors";
import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetModalProps,
} from "@gorhom/bottom-sheet";
import React, { forwardRef } from "react";

export type Ref = BottomSheetModal;

interface BottomModalProps extends BottomSheetModalProps {
	children: React.ReactNode;
}

const BottomModal = forwardRef<Ref, BottomModalProps>(
	({ children, ...props }, ref) => {
		return (
			<BottomSheetModal
				handleStyle={[
					{
						backgroundColor: COLORS.background,
						borderTopStartRadius: 16,
						borderTopEndRadius: 16,
					},
					props.handleStyle,
				]}
				handleIndicatorStyle={[
					{
						backgroundColor: COLORS.accent.DEFAULT,
						width: 64,
					},
					props.handleIndicatorStyle,
				]}
				backgroundStyle={[
					{
						backgroundColor: COLORS.background,
					},
					props.backgroundStyle,
				]}
				backdropComponent={(backdropProps) => (
					<BottomSheetBackdrop
						{...backdropProps}
						pressBehavior='close'
						disappearsOnIndex={-1}
						appearsOnIndex={0}
					/>
				)}
				ref={ref}
				{...props}
			>
				{children}
			</BottomSheetModal>
		);
	}
);

export default BottomModal;
