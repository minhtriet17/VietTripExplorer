import React from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'

const Advertise = () => {
  return (
    <div className='flex flex-col md:flex-row p-3 border border-teal-600
    justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
        <div className="flex-1 justify-center flex flex-col p-3 w-full md:w-3/5">
            <h2 className='text-2xl font-semibold text-wrap'>
                Want to know more about today's {" "}
                <span className='text-red-600'>Top 10 </span>news?
            </h2>

            <p className='text-gray-500 my-2'>
                Checkout these top news articles and stay updated with the latest trends.
            </p>

            <Button variant="outline" className="bg-blue-500 border border-slate-500 text-md mt-2 h-min">
                <Link to={"https://google.com"}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className='text-white font-semibold'
                >
                    Stay Updated with Top 10 News
                </Link>
            </Button>
        </div>
        <div className="p-7 w-full md:w-2/5">
            <img src="https://images.pexels.com/photos/3944454/pexels-photo-3944454.jpeg?auto=compress&cs=tinysrgb&w=300" 
                alt=""
                className='w-full'/>
        </div>
    </div>
  )
}

export default Advertise