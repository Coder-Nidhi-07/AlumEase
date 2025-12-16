import React from 'react'

function Card() {
  return (
    <div className='p-2'>
    
    <div>
                <div className="bg-gray-400 border-1 border-gray-400 h-64 w-60 rounded-2xl shadow-2xl shadow-gray-400 hover:shadow-3xl">
                  <h1 className="text-xl text-center p-2">Branches</h1>
                  <hr />
                  <ul className="text-center text-l p-2">
                    <li className="p-1 underline-on-hover">Computer Science</li>
                    <li className="p-1 underline-on-hover">Mechanical Engg.</li>
                    <li className="p-1 underline-on-hover">Electrical Engg.</li>
                    <li className="p-1 underline-on-hover">Civil Engg.</li>
                    <li className="p-1 underline-on-hover">
                      Electronics & Computer
                    </li>
                    <li className="p-1 underline-on-hover">Chemical Engg.</li>
                  </ul>
                </div>
              </div>
              <div>
                <div className="bg-gray-400 border-1 border-gray-400 h-64 w-60 rounded-2xl shadow-2xl shadow-gray-400 hover:shadow-3xl">
                  <h1 className="text-xl text-center p-2">Batches</h1>
                  <hr />
                  <ul className="text-center text-l p-2">
                    <li className="p-1 underline-on-hover">2020</li>
                    <li className="p-1 underline-on-hover">2021</li>
                    <li className="p-1 underline-on-hover">2022</li>
                    <li className="p-1 underline-on-hover">2023</li>
                    <li className="p-1 underline-on-hover">2024</li>
                    <li className="p-1 underline-on-hover">2025</li>
                  </ul>
                </div>
              </div>
              </div>
  )
}

export default Card
