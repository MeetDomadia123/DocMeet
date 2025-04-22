import { createContext, useState } from "react";
import axios from 'axios'
import { toast } from 'react-toastify';

export const AdminContext= createContext();

const AdminContextProvider=(props)=>{



    const [atoken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : "");

    const [doctors,setDoctors]=useState([])
    const backendUrl= import.meta.env.VITE_BACKEND_URL

    const getAllDoctors = async () => {
        try {
            console.log(atoken)
          const { data } = await axios.post(
            `${backendUrl}/api/admin/all-doctors`,
            {},
            {
              headers: { atoken },
            }
          );
      
          console.log("API Response:", data); // Debugging log
      
          if (data.success) {
            setDoctors(data.doctor);
            console.log("Doctors fetched:", data.doctor); // Debugging log
          } else {
            toast.error(data.message);
          }
        } catch (error) {
          console.error("Error fetching doctors:", error);
          toast.error(error.message || "An error occurred while fetching doctors.");
        }
      };

      const changeAvailablity = async (docId) => {
      
        try {
          const { data } = await axios.post(
            `${backendUrl}/api/admin/change-availablity`,
            { docId },
            {
              headers: { atoken },
            }
          );
      
          if (data.success) {
            toast.success(data.message);
            getAllDoctors(); 
          } else {
            toast.error(data.message);
          }
        } catch (error) {
          console.error("Error changing availability:", error);
          toast.error("An error occurred while changing availability.");
        }
      };

    const value={
        atoken,
        setAToken,
        backendUrl,
        doctors,
        getAllDoctors,
        changeAvailablity,

    }

    return (
        <AdminContext.Provider  value={value}>
            {
                props.children
            }
        </AdminContext.Provider>
    )
}


export default AdminContextProvider