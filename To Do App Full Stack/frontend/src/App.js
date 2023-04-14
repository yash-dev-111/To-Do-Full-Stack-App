import React, { useEffect, useState } from "react";
import { useRef } from "react";
import './App.css'
 import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios'


const App = () => {
    const [todoState, setToDoState] = useState("");
    const [itemList, setItemlist] = useState([]);



    const getAllTasks = async()=>{
        const {data} = await axios.get("http://localhost:8081/todo_db/get")
        console.log(data)
        setItemlist(data?.data)
    }

    const onsubmitHandler = (e) => {
        e.preventDefault();
        if (!todoState) 
        return;
        try {
            fetch("http://localhost:8081/todo_db", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    todo_name: todoState,
                }),
            }).then(() => {
                
                setItemlist((itemList) => [
                    ...itemList,
                    { todo_name: todoState },
                ]);
                setToDoState("");
            });
            getAllTasks()
        } catch (err) {
            console.log(err.message);
        }
    };

    useEffect(() => {
        fetch("http://localhost:8081/todo_db/get")
            .then((response) => response.json())
            .then((data) => setItemlist(data.data));
    }, []);

    console.log(itemList)


    const handleDelete=async(id)=>{
      try{
        await axios.delete(`http://localhost:8081/todo_db/delete/${id}`)
        getAllTasks()
        
      
      }catch(error){
       console.log(error)
      }

    }
 

    const inputRef = useRef(null);
    useEffect(() => {
        inputRef.current.focus();
    });

    return (
        <>
            <header>
                <h1>To Do List App</h1>
            </header>
            <form onSubmit={onsubmitHandler}>
                <div className="input-box">
                <button className='b1' type="button" disabled>Enter the task:</button>&nbsp;&nbsp;
                    <input className="input-style"
                        placeholder="Enter a task that needs to be done.."
                        type="text"
                        ref={inputRef}
                        value={todoState}
                        onChange={(e) => {
                            setToDoState(e.target.value);
                        }}
                    />&nbsp;&nbsp;
                    <button className='b2'type="submit">Add Task</button>
                </div>
            </form>


            <div>
                <ol className="allTodo">
                    {itemList && 
                    itemList.map((item,index) => {
                        return (
                            <div   className="single-todo">           
                                <li key={index}>{item.todo_name}
                                
                             
                                <FontAwesomeIcon
                                    icon={faTrash}
                                    className="icon"
                                    onClick={()=>handleDelete(item.todo_id)}
                                />
                                
                                </li>
                                
                                
                                

                            </div>
                        );
                    })}
                </ol>
            </div>
        </>
    );
};

export default App;