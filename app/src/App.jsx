import React, { useState, useRef } from 'react'
import './App.css'
import axios from 'axios'

export default function App() {
  const [shortUrl, setShortUrl] = useState('');
  const urlRef = useRef();

  const handleSubmit = async () => {
    const url = urlRef.current.value;
    if (!url) {
      alert('Please enter a URL to shorten');
      return;
    }
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/`, { url }, { headers: { "content-type": "application/json" } });
      // console.log(response.data);
      setShortUrl(response.data);
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen px-4 py-10">
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-center">Long URL?</h1>
      <h2 className="text-xl md:text-3xl lg:text-4xl font-light mb-8 text-center">Shorten it here 👇⬇️</h2>

      <div className="flex flex-col sm:flex-row items-center w-full max-w-3xl gap-4 mb-8">
        <input
          className="flex-1 w-full h-12 px-5 border rounded-2xl text-base md:text-lg pt-2 pb-2
        border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          type="text"
          placeholder="Enter URL to Shorten"
          ref={urlRef}
        />
        <button
          className="w-full sm:w-auto bg-blue-500 hover:bg-blue-700 text-white text-base md:text-lg 
        font-semibold py-2 px-6 rounded-2xl transition active:translate-y-1"
          onClick={handleSubmit}
        >
          Shorten
        </button>
      </div>

      {shortUrl && (
        <p className="text-center text-lg md:text-xl font-medium break-words max-w-xl">
          Short URL:&nbsp;
          <a href={shortUrl} className="underline text-blue-500 break-all">
            {shortUrl}
          </a>
        </p>
      )}
    </div>

  )
}
