"use client";
import React, { useState } from "react";

type ProgressiveImageProps = {
	src: string;
	alt?: string;
	className?: string; // passed to <img>
	wrapperClass?: string; // class for wrapper div
	lowResWidth?: number; // default 20
	lowResHeight?: number; // default 10
};

export default function ProgressiveImage({
	src,
	alt,
	className = "",
	wrapperClass = "",
	lowResWidth = 1,
	lowResHeight = 1,
}: ProgressiveImageProps) {
	const [loaded, setLoaded] = useState(false);
	const [lowLoaded, setLowLoaded] = useState(false);

	// Try to map src from .../WIDTH/HEIGHT to a very small version for blur
	function getLowRes(src: string) {
		const match = src.match(/^(.*)\/\d+\/\d+$/);
		if (!match) return src;
		return `${match[1]}/${lowResWidth}/${lowResHeight}`;
	}

	const lowRes = getLowRes(src);

	return (
		<div
			className={`relative overflow-hidden bg-muted ${wrapperClass}`}
			style={{
				backgroundImage: `url(${lowRes})`,
				backgroundSize: "cover",
				backgroundPosition: "center center",
			}}
		>
			{/* Low-res stretched image - eager load */}
			<img
				src={lowRes}
				alt=""
				aria-hidden
				loading="eager"
				decoding="async"
				onLoad={() => setLowLoaded(true)}
				className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ease-linear blur-2xl scale-105 z-0 ${
					lowLoaded && !loaded ? "opacity-100" : "opacity-0"
				}`}
			/>

			{/* High-res image */}
			<img
				src={src}
				alt={alt}
				loading="lazy"
				decoding="async"
				className={`w-full h-full object-cover transition-opacity duration-300 z-10 ${
					loaded ? "opacity-100" : "opacity-0"
				} ${className}`}
				onLoad={() => setLoaded(true)}
			/>

			{/* Optional overlay while both loading */}
			{!lowLoaded && !loaded && (
				<div className="absolute inset-0 bg-white/10 backdrop-blur-sm z-20 rounded-tl-lg rounded-tr-lg "></div>
			)}
		</div>
	);
}
