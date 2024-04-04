import React from "react";

function QuoteItem({ name, message, time }) {
  return (
    <div>
      <p>{name}</p>
      <p>{message}</p>
      <p>{time}</p>
    </div>
  );
}

export default QuoteItem;
