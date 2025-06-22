import { useState, useEffect } from 'react';

type Callbacks = {
	onOpen?: () => void;
	onClose?: () => void;
};

export const useDisclosure = (
	initialState = false,
	{ onOpen, onClose }: Callbacks = {}
) => {
	const [isOpen, setIsOpen] = useState(initialState);

	useEffect(() => {
		setIsOpen(initialState);
	}, [initialState]);

	const open = () => {
		setIsOpen(true);
		onOpen?.();
	};

	const close = () => {
		setIsOpen(false);
		onClose?.();
	};

	const toggle = () => {
		isOpen ? close() : open();
	};

	return { isOpen, open, close, toggle };
};
