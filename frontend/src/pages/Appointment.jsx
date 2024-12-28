import axios from 'axios';
import React, { useState } from 'react';

function Appointment() {

  const [date, setData] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [maxPatient, setMaxPatient] = useState(0)
  const [priceString, setPriceString] = useState(0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:3000/api/appointment/create', { date, startTime, endTime, maxPatient, priceString }, { withCredentials: true })
      if (res.data) {
        alert('Appointment Created')
      }
      setData('');
      setStartTime('');
      setEndTime('');
      setMaxPatient('');
    } catch (error) {
      console.log(error)
    }
  }



  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create Appointment</h2>
        <form onSubmit={handleSubmit}>
          {/* Date */}
          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setData(e.target.value)}
              name="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Start Time */}
          <div className="mb-4">
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              id="startTime"
              name="startTime"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* End Time */}
          <div className="mb-4">
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              id="endTime"
              name="endTime"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Price */}
          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <input
              type="number"
              id="price"
              value={priceString}
              onChange={(e) => setPriceString(e.target.value)}
              name="price"
              placeholder="Enter the price for the appointment"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Max Patients */}
          <div className="mb-4">
            <label htmlFor="maxPatient" className="block text-sm font-medium text-gray-700 mb-1">Max Patients</label>
            <input
              type="number"
              id="maxPatient"
              value={maxPatient}
              onChange={(e) => (setMaxPatient(e.target.value))}
              name="maxPatient"
              placeholder="Enter maximum patients"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Current Count */}
          {/* <div className="mb-4">
            <label htmlFor="currentCount" className="block text-sm font-medium text-gray-700 mb-1">Current Count</label>
            <input
              type="number"
              id="currentCount"
              name="currentCount"
              value="0"
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div> */}

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Create Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Appointment;
