import React, { useContext } from 'react'
import { Context } from '../Router/control'
import Navbar from '../components/navbar'
function Dashboard() {
    const [checkExist, setCheckExist] = useContext(Context)
    const logout = () => {
        localStorage.clear()
        setCheckExist(null)
    }
    return (
        <div>
           <Navbar/>
        </div>
    )
}

export default Dashboard 