import React, { useState} from "react";
import axios from "axios";

export default function Wallet() {
    const [name, setName] = useState("");
    const [balance, setBalance] = useState(0.0);
    const [listTrans, setListTrans] = useState([]);
    const [gotData,setGotData] = useState(false)

    function changeHandler(event) {
        setGotData(false)
        setName(event.target.value);
     }
  
     function submitForm(event) {
        event.preventDefault();
        axios
            .get("http://0.0.0.0:5010/chain")
            .then(response => {
                let arrayBlocks = response.data.chain
                // console.log(arrayBlocks)
                let tempArray = []
                arrayBlocks.forEach(block=>{
                    block.transactions.forEach(trans=>{
                        if(trans.recipient === name || trans.sender === name){
                            tempArray.push(trans) 
                        }
                    })
                })
                setListTrans(tempArray)
                let sum = 0
                tempArray.forEach(tran=>{
                    if(tran.recipient == name) {
                        sum = sum + tran.amount
                    }
                    else {
                        sum = sum - tran.amount
                    }
                })
                setBalance(sum)
            })
            .catch(err=>{
                console.log(err);
            })
        setGotData(true)
      };


    return (
        <>
            <form onSubmit={submitForm}>
                <label htmlFor="name">Wallet Owner Name:</label>
                <input
                    required
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Name"
                    onChange={changeHandler}
                    value={name}         
                />
                <button className="formButton" type="submit">
                    View data
                </button>
            </form>
            {/* <p>
                {`The owners name is: ${name}`}
            </p> */}
            {/* {
                console.log("The transactions",listTrans)
            } */}
            { (gotData && listTrans.length !== 0) && (
                <div>
                    <h2>Balance for {name}: {balance}</h2>
                    <h2>List of transactions for {name}:</h2>
                    {listTrans.map(function(tran,index) {
                        return <p key={index}>recipient:{tran.recipient}, sender:{tran.sender}, amount:{tran.amount}</p>;
                    })}
                </div>        
                

            )}

            

        </>
    );

} // end function wallet