import React, { createContext,useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import App from '../App'
export const Context = createContext()
function control() {
    const [checkExist,setCheckExist] = useState(JSON.parse(localStorage.getItem('username')))
    
    return (
        <Context.Provider value={[checkExist,setCheckExist]}>
            <BrowserRouter>
                <Routes>
                    {
                        checkExist && <Route path='/' exact element={<Dashboard />} />
                        
                    }
                    {
                        !checkExist && <Route path='/' element={<App />} />
                    }
                </Routes>
            </BrowserRouter>
        </Context.Provider>
    )
}

export default control