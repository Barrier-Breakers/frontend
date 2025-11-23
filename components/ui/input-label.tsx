"use client";

import { useId, useState } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const InputFloat = ({
	label,
	placeholder,
	className,
	type,
	name,
	required,
	value,
	onChange,
	autoFocus,
	onKeyDown,
}: {
	label?: string;
	placeholder?: string;
	className?: string;
	type?: string;
	name?: string;
	required?: boolean;
	value?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
	autoFocus?: boolean;
}) => {
	const id = useId();
	const [isFocused, setIsFocused] = useState(false);

	return (
		<>
			<style>{`
				.input-label-cover {
					position: relative;
					display: inline-block;
					padding: 0 0.5rem;
					background: linear-gradient(
						to top,
						white 0%,
						white 50%,
						transparent 50%,
						transparent 100%
					);
					margin: 0 -0.5rem;
					padding-top: 2px;
				}

			`}</style>
			<div className={cn("group relative w-full", className)}>
				<label
					htmlFor={id}
					className="origin-start ml-2 text-muted-foreground group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:text-foreground absolute top-1/2 block -translate-y-1/2 cursor-text px-2 text-sm transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-md group-focus-within:font-bold has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-md has-[+input:not(:placeholder-shown)]:font-bold"
				>
					<span className="input-label-cover font-bold">{label}</span>
				</label>
				<Input
					id={id}
					type={type}
					name={name}
					value={value}
					onChange={onChange}
					onKeyDown={onKeyDown}
					placeholder={isFocused ? placeholder : " "}
					required={required}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					autoFocus={autoFocus}
					className="dark:bg-background w-full sombroso nevasca border-2 font-semibold border-black h-12 font-lg"
					autoComplete="off"
				/>
			</div>
		</>
	);
};

export default InputFloat;
