"use client";

export default function TawkButton() {
  const handleShowWidget = () => {
    if (typeof window !== "undefined" && window.Tawk_API) {
      window.Tawk_API.showWidget();
    }
  };

  return (
    <button
      onClick={handleShowWidget}
      className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
    >
      Chat with us
    </button>
  );
}