import React, { useState, useEffect } from "react";
import "./App.css";
import QuoteItem from "./QuoteItem";

function App() {
	const [name, setName] = useState("");
	const [quote, setQuote] = useState("");
	const [quotes, setQuotes] = useState([]);
	const [interval, setInterval] = useState("all"); // Default to "all" interval

	useEffect(() => {
		fetchQuotes();
	}, [interval]);

	const fetchQuotes = async () => {
		try {
			const response = await fetch(`/api/quotes?interval=${interval}`);
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
		<h1 className="header">Hack at UCI Tech Deliverable</h1>

		<div class="submit-block">
			<h2 class="submit-header">Submit a quote</h2>
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
		</div>

		<h2 class="quotes-header">Previous Quotes</h2>
		
		<label class="filter-label">Filter by Age</label>
		
		<select
			className="filter-dropdown"
			value={interval}
			onChange={(e) => setInterval(e.target.value)}
		>
			<option value="all">All</option>
			<option value="week">Week</option>
			<option value="month">Month</option>
			<option value="year">Year</option>
		</select>

		<hr/>
		<div className="messages">
			{quotes.map((quote, index) => (
				<QuoteItem
					key={index}
					name={quote.name}
					message={quote.message}
					time={quote.time}
			  	/>
			))}
		</div>
	</div>
	);
}

export default App;
