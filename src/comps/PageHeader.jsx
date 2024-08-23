import React from "react";

export default function PageHeader({ title, sub, loading }) {
  return (
    <div className="mb-8 border pb-2 border-b border-white border-b-sky-500">
      <h1 className="text-xl text-sky-500">
        <span>{title}</span>

        {loading && (
          <span className="loading mx-1 loading-bars loading-xs"></span>
        )}
      </h1>
      <h5 className="text-gray-500">{sub}</h5>
    </div>
  );
}
