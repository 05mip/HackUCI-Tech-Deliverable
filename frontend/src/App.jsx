import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
	const [name, setName] = useState("");
	const [quote, setQuote] = useState("");
	const [quotes, setQuotes] = useState([]);

	useEffect(() => {
		fetchQuotes();
	}, []);

	const fetchQuotes = async () => {
		try {
			const response = await fetch("/api/quotes");
			if (!response.ok) {
				throw new Error("Failed to fetch quotes");
			}
			const data = await response.json();
			setQuotes(data);
		} catch (error) {
			console.error(error);
		}
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			const formData = new FormData();
			formData.append('name', name)
			formData.append('message', quote)

			const response = await fetch("/api/quote", {
				method: "POST",
				body: formData
			});
			if (!response.ok) {
				throw new Error("Failed to submit quote");
			}
			setName("");
			setQuote("");
			fetchQuotes();
		} catch (error) {
			console.error(error);
		}
	};

	return (
	<div className="App">
		<h1>Hack at UCI Tech Deliverable</h1>

		<h2>Submit a quote</h2>
		<form onSubmit={handleSubmit}>
		<label htmlFor="input-name">Name</label>
		<input
			type="text"
			name="name"
			id="input-name"
			value={name}
			onChange={(e) => setName(e.target.value)}
			required
		/>
		<label htmlFor="input-message">Quote</label>
		<input
			type="text"
			name="message"
			id="input-message"
			value={quote}
			onChange={(e) => setQuote(e.target.value)}
			required
		/>
		<button type="submit">Submit</button>
		</form>

		<h2>Previous Quotes</h2>
		<div className="messages">
		{quotes.map((quote, index) => (
			<div key={index}>
			<p>{quote.name}</p>
			<p>{quote.message}</p>
			<p>{quote.time}</p>
			</div>
		))}
		</div>
	</div>
	);
}

export default App;
