"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const AuthTest = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(false);

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			const response = await fetch(`${baseUrl}/api/auth/signup`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});
			const data = await response.json();
			if (response.ok) {
				// Armazena os tokens
				localStorage.setItem("access_token", data.session.access_token);
				localStorage.setItem("refresh_token", data.session.refresh_token || "");
				localStorage.setItem(
					"token_expires_at",
					String(Date.now() + (data.session.expires_in || 3600) * 1000),
				);
				alert("Sign up successful");
			} else {
				alert(`Error: ${data.message}`);
			}
		} catch (error) {
			console.error(error);
			alert("Error signing up");
		}
		setLoading(false);
	};

	const handleSignIn = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			const response = await fetch(`${baseUrl}/api/auth/signin`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});
			const data = await response.json();
			if (response.ok) {
				// Armazena os tokens
				localStorage.setItem("access_token", data.session.access_token);
				localStorage.setItem("refresh_token", data.session.refresh_token || "");
				localStorage.setItem(
					"token_expires_at",
					String(Date.now() + (data.expires_in || 3600) * 1000),
				);
				alert("Sign in successful");
			} else {
				alert(`Error: ${data.message}`);
			}
		} catch (error) {
			console.error(error);
			alert("Error signing in");
		}
		setLoading(false);
	};

	const handleGoogleSignIn = async () => {
		setLoading(true);
		try {
			const response = await fetch(`${baseUrl}/api/auth/signin/google`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					redirectTo: `${window.location.origin}/auth/callback`,
				}),
			});
			const data = await response.json();
			if (response.ok && data.url) {
				window.location.href = data.url;
			} else {
				alert(`Error: ${data.message}`);
			}
		} catch (error) {
			console.error(error);
			alert("Error with Google sign in");
		}
		setLoading(false);
	};

	const handleGetMe = async () => {
		const storedToken = localStorage.getItem("access_token");
		if (!storedToken) {
			alert("No token found");
			return;
		}
		setLoading(true);
		try {
			const response = await fetch(`${baseUrl}/api/auth/me`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${storedToken}`,
				},
			});
			const data = await response.json();
			if (response.ok) {
				setUser(data);
			} else {
				alert(`Error: ${data.message}`);
			}
		} catch (error) {
			console.error(error);
			alert("Error fetching user");
		}
		setLoading(false);
	};

	const handleLogout = async () => {
		setLoading(true);
		const storedToken = localStorage.getItem("access_token");

		try {
			// Call backend logout endpoint if token exists
			if (storedToken) {
				await fetch(`${baseUrl}/api/auth/logout`, {
					method: "POST",
					headers: {
						Authorization: `Bearer ${storedToken}`,
					},
				});
			}
		} catch (error) {
			console.error("Logout error:", error);
		} finally {
			// Clear all auth-related data from localStorage
			localStorage.removeItem("access_token");
			localStorage.removeItem("refresh_token");
			localStorage.removeItem("token_expires_at");

			// Clear user state
			setUser(null);
			setEmail("");
			setPassword("");

			setLoading(false);
			alert("Logged out successfully");
		}
	};

	return (
		<div className="container mx-auto p-4 space-y-6">
			<h1 className="text-2xl font-bold">Auth Test</h1>

			<Card>
				<CardHeader>
					<CardTitle>Sign Up</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSignUp} className="space-y-4">
						<div>
							<Label htmlFor="signup-email">Email</Label>
							<Input
								id="signup-email"
								type="email"
								placeholder="Email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div>
							<Label htmlFor="signup-password">Password</Label>
							<Input
								id="signup-password"
								type="password"
								placeholder="Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
						<Button type="submit" disabled={loading}>
							Sign Up
						</Button>
					</form>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Sign In</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSignIn} className="space-y-4">
						<div>
							<Label htmlFor="signin-email">Email</Label>
							<Input
								id="signin-email"
								type="email"
								placeholder="Email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div>
							<Label htmlFor="signin-password">Password</Label>
							<Input
								id="signin-password"
								type="password"
								placeholder="Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
						<Button type="submit" disabled={loading}>
							Sign In
						</Button>
					</form>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Google Sign In</CardTitle>
				</CardHeader>
				<CardContent>
					<Button onClick={handleGoogleSignIn} disabled={loading}>
						Sign In with Google
					</Button>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Get Current User</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<Button onClick={handleGetMe} disabled={loading}>
						Get Me
					</Button>
					{user && (
						<pre className="bg-muted p-4 rounded-md overflow-auto">
							{JSON.stringify(user, null, 2)}
						</pre>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Logout</CardTitle>
				</CardHeader>
				<CardContent>
					<Button
						onClick={handleLogout}
						disabled={loading}
						variant="destructive"
					>
						Logout
					</Button>
				</CardContent>
			</Card>
		</div>
	);
};

export default AuthTest;
