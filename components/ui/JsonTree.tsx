"use client";

import React, { useState } from "react";

type JsonTreeProps = {
	data: any;
	name?: string;
	depth?: number;
	defaultCollapsed?: boolean;
};

function isObject(val: any) {
	return val !== null && typeof val === "object" && !Array.isArray(val);
}

function renderValue(value: any) {
	if (value === null) return <span className="text-muted-foreground">null</span>;
	switch (typeof value) {
		case "string":
			return <span className="text-green-700">"{value}"</span>;
		case "number":
			return <span className="text-blue-700">{String(value)}</span>;
		case "boolean":
			return <span className="text-purple-700">{String(value)}</span>;
		default:
			return <span>{String(value)}</span>;
	}
}

export default function JsonTree({
	data,
	name,
	depth = 0,
	defaultCollapsed = true,
}: JsonTreeProps) {
	const [collapsed, setCollapsed] = useState(defaultCollapsed && depth > 0);

	if (Array.isArray(data)) {
		return (
			<div className="text-sm font-mono">
				<div className="flex items-center gap-2">
					<button
						className="text-xs text-muted-foreground"
						onClick={() => setCollapsed((c) => !c)}
						aria-expanded={!collapsed}
					>
						{collapsed ? "+" : "-"}
					</button>
					<span className="text-muted-foreground">{name ? `${name}: ` : ""}[Array]</span>
				</div>
				{!collapsed && (
					<div className="ml-4 mt-1 space-y-1">
						{data.map((item: any, i: number) => (
							<div key={i}>
								<JsonTree
									data={item}
									name={`${i}`}
									depth={depth + 1}
									defaultCollapsed={defaultCollapsed}
								/>
							</div>
						))}
					</div>
				)}
			</div>
		);
	}

	if (isObject(data)) {
		const keys = Object.keys(data);
		return (
			<div className="text-sm font-mono">
				<div className="flex items-center gap-2">
					<button
						className="text-xs text-muted-foreground"
						onClick={() => setCollapsed((c) => !c)}
						aria-expanded={!collapsed}
					>
						{collapsed ? "+" : "-"}
					</button>
					<span className="text-muted-foreground">
						{name ? `${name}: ` : ""}
						{`{Object} (${keys.length})`}
					</span>
				</div>
				{!collapsed && (
					<div className="ml-4 mt-1 space-y-1">
						{keys.map((k) => (
							<div key={k}>
								<JsonTree
									data={data[k]}
									name={k}
									depth={depth + 1}
									defaultCollapsed={defaultCollapsed}
								/>
							</div>
						))}
					</div>
				)}
			</div>
		);
	}

	// Primitive
	return (
		<div className="text-sm font-mono wrap-break-word">
			{name ? <span className="text-muted-foreground">{name}: </span> : null}
			{renderValue(data)}
		</div>
	);
}
