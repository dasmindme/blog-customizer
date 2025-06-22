import { useState, useRef, useEffect } from 'react';
import { useDisclosure } from 'src/hooks/useDisclosure';
import clsx from 'clsx';

import {
	OptionType,
	ArticleStateType,
	defaultArticleState,
	fontFamilyOptions,
	fontSizeOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
} from 'src/constants/articleProps';

import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import { Button } from 'src/ui/button';
import { Separator } from 'src/ui/separator';
import { Text } from 'src/ui/text';
import { ArrowButton } from 'src/ui/arrow-button';

import styles from './ArticleParamsForm.module.scss';

// Тип пропсов компонента
type ArticleParamsFormProps = {
	onApply: (state: ArticleStateType) => void;
};

export const ArticleParamsForm = ({ onApply }: ArticleParamsFormProps) => {
	// Дефолтное состояние в useRef, чтобы не пересоздавалось при каждом рендере
	const defaultState = useRef(defaultArticleState);

	// Ссылка на aside, чтобы отслеживать клики вне формы
	const asideRef = useRef<HTMLElement | null>(null);

	// Кастомный хук для управления открытием/закрытием меню
	const {
		isOpen: isMenuOpen,
		close: closeMenu,
		toggle: toggleMenu,
	} = useDisclosure(false);

	// Локальные состояния параметров формы
	const [fontFamily, setFontFamily] = useState<OptionType>(
		defaultState.current.fontFamilyOption
	);
	const [fontSize, setFontSize] = useState<OptionType>(
		defaultState.current.fontSizeOption
	);
	const [fontColor, setFontColor] = useState<OptionType>(
		defaultState.current.fontColor
	);
	const [backgroundColor, setBackgroundColor] = useState<OptionType>(
		defaultState.current.backgroundColor
	);
	const [contentWidth, setContentWidth] = useState<OptionType>(
		defaultState.current.contentWidth
	);

	// Применение выбранных параметров
	const handleApply = () => {
		onApply({
			fontFamilyOption: fontFamily,
			fontSizeOption: fontSize,
			fontColor: fontColor,
			backgroundColor: backgroundColor,
			contentWidth: contentWidth,
		});
		closeMenu();
	};

	// Сброс параметров к значениям по умолчанию
	const handleReset = () => {
		setFontFamily(defaultState.current.fontFamilyOption);
		setFontSize(defaultState.current.fontSizeOption);
		setFontColor(defaultState.current.fontColor);
		setBackgroundColor(defaultState.current.backgroundColor);
		setContentWidth(defaultState.current.contentWidth);

		onApply(defaultState.current);
		closeMenu();
	};

	// Закрытие меню при клике вне формы
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				asideRef.current &&
				!asideRef.current.contains(event.target as Node)
			) {
				closeMenu();
			}
		};

		if (isMenuOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isMenuOpen, closeMenu]);

	return (
		<>
			<div className={styles.arrowButtonWrapper}>
				<ArrowButton isOpen={isMenuOpen} onClick={toggleMenu} />
			</div>

			<aside
				className={clsx(styles.container, {
					[styles.container_open]: isMenuOpen,
				})}
				ref={asideRef}>
				<form className={styles.form} onSubmit={(e) => e.preventDefault()}>
					<Text size={31} weight={800} uppercase>
						Задайте параметры
					</Text>

					<Select
						title='Шрифт'
						selected={fontFamily}
						options={fontFamilyOptions}
						onChange={setFontFamily}
					/>

					<RadioGroup
						name='fontSize'
						title='Размер шрифта'
						options={fontSizeOptions}
						selected={fontSize}
						onChange={setFontSize}
					/>

					<Select
						title='Цвет шрифта'
						selected={fontColor}
						options={fontColors}
						onChange={setFontColor}
					/>

					<Select
						title='Цвет фона'
						selected={backgroundColor}
						options={backgroundColors}
						onChange={setBackgroundColor}
					/>

					<Select
						title='Ширина контента'
						selected={contentWidth}
						options={contentWidthArr}
						onChange={setContentWidth}
					/>

					<Separator />

					<div className={styles.bottomContainer}>
						<Button
							title='Сбросить'
							htmlType='button'
							type='clear'
							onClick={handleReset}
						/>
						<Button
							title='Применить'
							htmlType='button'
							type='apply'
							onClick={handleApply}
						/>
					</div>
				</form>
			</aside>
		</>
	);
};
