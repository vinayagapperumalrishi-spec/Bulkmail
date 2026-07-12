import { useState } from 'react'
import './index.css'
import axios from "axios"
import * as XLSX from "xlsx"


function App() {

const [msg,setmsg] = useState("")
const [status,setsatuts] = useState(false)
const [emailList,setEmailList] = useState("")



function handlemsg(evt)
{
  setmsg(evt.target.value)
}
function handlefile(event){
  const file = event.target.files[0];
 console.log(file);
 const reader = new FileReader();

 reader.onload = function(e){
     const data = e.target.result;
     const workbook = XLSX.read(data, { type: 'binary' });
     const sheetName = workbook.SheetNames[0]
     const worksheet = workbook.Sheets[sheetName];
     const emailList = XLSX.utils.sheet_to_json(worksheet, { header: "A"});
     const totalemail = emailList.map(function(item){return item.A})
     console.log(totalemail)
     setEmailList(totalemail)
 }


 reader.readAsBinaryString(file);
}
function send(){
  setsatuts(true)
   axios.post("https://bulkmail-1-rsbg.onrender.com/sendmail",{msg:msg,emailList:emailList})
   .then(function(data){
     if(data.data === true){
      alert("மெயில் வெற்றியாக அனுப்பப்பட்டது.✅")
      setsatuts(false)
     }
     else{
      alert("மெயில் அனுப்ப முடியவில்லை. ❌")
     }
   })
   .catch(function(error){
    console.log(error);
    alert("Server Error ❌");
    setsatuts(false);
})
}

  return(
    
  
    <div>
    
         
      <div className='one'> 
     <h1 className='two'>Bulk Email📧</h1>
      </div>

      <div className='three'> 
     <h1 className='four'>We can help business with sending multiple emails at once</h1>
      </div>

      <div className='six'> 
     <h1 className='seven'>Drag and Drop</h1>
      </div>

      <div className='eight'>
        <textarea onChange={handlemsg} value={msg} className='nine' placeholder='Enter the email text....' ></textarea>
        <div>
          <input type='file' onChange={handlefile}  className='ten' />
          <p className='go'>Total Emails in this File:{emailList.length}</p>
          <button onClick={send} className='eleven'>{status?"Sending...":"Send"}</button>
        </div>
      </div>
   </div>

  )
 
}

export default App