import React, { useState, useCallback } from "react";
import debounce from "lodash/debounce";

const AddRecommendation = ({ onAdd }) => {
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  const debouncedHandleAdd = useCallback(
    debounce(async () => {
      try {
        const result = await onAdd();
        if (result) {
          setMessage("Recommendation added successfully!");
        } else {
          setMessage("Failed to add recommendation. Please try again.");
        }
      } catch (error) {
        setMessage(`Error: ${error.message}`);
      }
      setShowModal(true);
    }, 300),
    [onAdd]
  );

  return (
    <>
      <button
        onClick={debouncedHandleAdd}
        className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
      >
        Add Recommendation
      </button>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded">
            <p>{message}</p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-2 bg-black hover:bg-gray-800 text-white font-bold py-1 px-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AddRecommendation;
