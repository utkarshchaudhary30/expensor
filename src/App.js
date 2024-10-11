import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
 
function Button({children,onClick}){
  return <button className="button" onClick={onClick}>{children}</button>
 }
export default function App() {
  const [addshowfriend,setaddshowfriend]=useState(false);
  const [friends,setfriends]= useState(initialFriends);
  const [selectedfriend,setselectedfriend]=useState(null);
    
  function handleshowaddfriend(){
       setaddshowfriend((show)=>!show)
  }
  function handleaddfriend(input){
    setfriends((f)=>[...f,input])
    setaddshowfriend(false);
  }
  function handleselection(x){
    setselectedfriend((cur)=>(cur?.id===x.id? null:x))

  }
    function handlesplitbill(value){
        setfriends((f)=>f.map((input)=>input.id===selectedfriend.id?{...input,balance:input.balance+value}:input))
        setselectedfriend(null);
    }  
  

  return (
   
    <div className="app">
      <div className="sidebar">
      <Friendlist friends={friends} onselection={handleselection} selectedfriend={selectedfriend} />
      {addshowfriend &&<Formaddfriend onaddfriend={handleaddfriend}/>}
      <Button onClick={handleshowaddfriend}>{addshowfriend?"close":"add friend"}</Button>

    </div>
    { selectedfriend &&<Formplitbill selectedfriend={selectedfriend} onsplitbill={handlesplitbill}/>   }
    </div>
  );
}
function Friendlist({friends,onselection,selectedfriend}){

  return(
    <ul>
     {friends.map((data)=>(
      <Friend x={data} key={data.id} onselection={onselection} selectedfriend={selectedfriend}/>
     ))}
    </ul>
  )
}
function Friend({x ,onselection,selectedfriend}){ 
  const isselected =  selectedfriend?.name === x.name;
  console.log(isselected);

return(
  <li className={isselected? "selected":""}> 
    <img src={x.image} alt={x.name}></img>
    <h3>{x.name}</h3>
    {x.balance <0 && <p className="red">you owe to {x.name} Rs.{Math.abs(x.balance)}</p>}
    {x.balance >0 && <p className="green">{x.name} owes you Rs.{Math.abs(x.balance)}</p>}
    {x.balance ===0 && <p className="black"> You and {x.name} are even </p>}

  <Button onClick={()=>onselection(x)}>{isselected?"Close":"select"}</Button>
    </li> 

)
}

function Formaddfriend({onaddfriend}){
  const [name,setname]=useState("")
  const [image, setimage] = useState("https://i.pravatar.cc/48")

   function handlesubmit(e){
     e.preventDefault();

     if(!name||!image) return;  
     const id=crypto.randomUUID();
     const newfriend={
      name,
      image:`${image}=${id}`,
      balance:0,
      id,

     };
     onaddfriend(newfriend);
     setname('')
     setimage("https://i.pravatar.cc/48")
   }

  return(
    <form className="form-add-friend" onSubmit={handlesubmit}>
  <label>👫Friend   name</label>
  <input type="text" value={name} onChange={(e)=> setname(e.target.value)}></input>
  <label>🌄Image url</label>
  <input type="text" value={image} onChange={(e)=>setimage(e.target.value)}></input>
  <Button>Add</Button>



    </form>
  )
}
function Formplitbill({selectedfriend ,onsplitbill}){
  const [bill,setbill]=useState("")
  const [paidbyuser,setpaidbyuser]=useState("")
  const paidbyfriend= bill? bill-paidbyuser:"";
  const [whoispaying,setwhoispaying]=useState("user")

   function handlesubmit(e){
     e.preventDefault();
     if(!bill || !paidbyuser) return
     onsplitbill(whoispaying === 'user'? paidbyfriend: -paidbyuser)
   }
  return(
    <form className="form-split-bill" onSubmit={handlesubmit}>
      <h2>split the bill with {selectedfriend.name}</h2>
      <label>💰Bill value</label>
      <input type="text" value={bill} onChange={(e)=> setbill(Number(e.target.value))}></input>
      <label>🧍‍♀️Your expense</label>
      <input type="text" value={paidbyuser} onChange={(e)=> setpaidbyuser(Number(e.target.value) >bill ? paidbyuser
        : Number(e.target.value))}></input>
      <label> 👫{selectedfriend.name}'s expense</label>
      <input type="text" disabled value={paidbyfriend}></input>
      <label>🤑Who is paying the bill</label>
      <select value={whoispaying} onChange={(e)=> setwhoispaying(e.target.value)}>
      <option value="user" >You</option>
        <option value="friend">{selectedfriend.name}</option>
      </select>   
       

      <Button >Split bill</Button>

    </form>
  )
}

