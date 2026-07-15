import { useState } from "react";
import "./index.css";
import axios from "axios";
import * as XLSX from "xlsx";

function App() {
  const [msg, setmsg] = useState("");
  const [status, setstatus] = useState(false);
  const [emailList, setEmailList] = useState([]);

  function handlemsg(evt) {
    setmsg(evt.target.value);
  }

  function handlefile(event) {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const rows = XLSX.utils.sheet_to_json(worksheet, {
        header: "A",
      });

      const totalEmails = rows
        .map((item) => item.A)
        .filter((email) => email && email.includes("@"));

      console.log(totalEmails);
      setEmailList(totalEmails);
    };

    reader.readAsBinaryString(file);
  }

  function send() {
    if (msg.trim() === "") {
      alert("Please enter email message");
      return;
    }

    if (emailList.length === 0) {
      alert("Please upload an Excel file");
      return;
    }

    setstatus(true);

    axios.post(" https://bulkmail-t07p.onrender.com/sendmail", {msg,emailList,}).then((res) => {
        if (res.data === true) {
          alert("மெயில் வெற்றியாக அனுப்பப்பட்டது.✅");
        } else {
          alert("மெயில் அனுப்ப முடியவில்லை.❌");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Server Error ❌");
      })
      .finally(() => {
        setstatus(false);
      });
  }

  return (
    <div>
      <div className="one">
        <h1 className="two">Bulk Email📧</h1>
      </div>

      <div className="three">
        <h1 className="four">
          We can help business with sending multiple emails at once
        </h1>
      </div>

      <div className="six">
        <h1 className="seven">Drag and Drop</h1>
      </div>

      <div className="eight">
        <textarea
          className="nine"
          placeholder="Enter the email text..."
          value={msg}
          onChange={handlemsg}
        ></textarea>

        <div>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handlefile}
            className="ten" />

          <p className="go">
            Total Emails in this File: {emailList.length}
          </p>

          <button className="eleven" onClick={send}disabled={status}>{status ? "Sending..." : "Send"}</button>
         </div>
      </div>
    </div>
  );
}

export default App;