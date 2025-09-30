import { BottomSheetModal, BottomSheetModalProps } from "@gorhom/bottom-sheet";
import React, { forwardRef } from "react";

export type Ref = BottomSheetModal;

interface BottomModalProps extends BottomSheetModalProps {
	children: React.ReactNode;
}

const BottomModal = forwardRef<Ref, BottomModalProps>(
	({ children, ...props }, ref) => {
		return (
			<BottomSheetModal ref={ref} {...props}>
				{children}
			</BottomSheetModal>
		);
	}
);

export default BottomModal;
