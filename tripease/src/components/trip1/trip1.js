import React, { useState, useEffect } from "react"
import styles from "./trip1.module.css"
import { message } from "antd"
import Navbar from "../../components/navbar/Navbar"
import axiosInstance from "../../interceptors/interceptor"
export default function Trip1() {

    const [expenseData, setExpenseData] = useState([])
    const [tripData, settripData] = useState([])
    const [searchText, setSearchText] = useState('');
    const [search, setSearch] = useState(false)
    const [tripname, setTripname] = useState('')  
    const [expenses, setexpenses] = useState({ expenseName: "", expenseAmount: "" })  
    const [budgetNameForExpense, setBudgetNameForExpense] = useState('')
    const[selectedTripName,setSelectedTripName]=useState(null)
    const [visibleIcons, setVisibleIcons] = useState({});
    /*Modal state variables*/
    const [showFilter, setShowFilter] = useState(false)
    const [showExpenseFilter, setShowExpenseFilter] = useState(false)
    const [displayFilter, setdisplayFilter] = useState(false)
    const [displayExpenseFilter, setdisplayExpenseFilter] = useState(false)

    useEffect(() => {
        showTripList()
    }, [])

    const toggleVisibilityIcon = async (budgetName) => {
        setVisibleIcons((prev) => ({
            ...prev,
            [budgetName]: !prev[budgetName],
        }));
        if(visibleIcons[budgetName]==undefined|| visibleIcons[budgetName]==false)
        {
            displayExpenses(budgetName)
        }
        else{
            setExpenseData([])
        }
    };
    /*Api calls*/
    async function showTripList() {
        try {
            const response = await axiosInstance.get("https://tripease-uug5.onrender.com/trip-management/displayTripList")
            if (response.data.success) {
                settripData(response.data.data)

            }
            else {

                message.success(response.data.message)
            }
        }
        catch (err) {

            message.error("something went wrong")
        }
    }

    async function handleSubmit() {
        if (tripname) {
            try {
                const response = await axiosInstance.post("https://tripease-uug5.onrender.com/trip-management/addTripName", { tripname })

                if (response.data.success) {
                    showTripList()
                    setShowFilter(false)
                    message.success(response.data.message)

                }
                else {

                    message.success(response.data.message)
                }
            }
            catch (err) {

                message.error("something went wrong")
            }
        }
        else {
            message.error("Please, Enter trip Name")
        }
    }
    async function handleExpenseSubmit() {

         if (expenses) {
            try {
                if(!expenses.expenseAmount || !expenses.expenseName){
                    message.error("enter valid details")
                    return
                }
                const response = await axiosInstance.post("https://tripease-uug5.onrender.com/trip-management/expenseData", { expenses, budgetNameForExpense })

                if (response.data.success) {
                    message.success(response.data.message)
                    if(selectedTripName)
                        displayExpenses(selectedTripName)

                }
                else {

                    message.success(response.data.message)

                }
                setShowExpenseFilter(false)
            }
            catch (err) {

                message.error(err.message)
            }
        }
        else {
            message.error("Enter expense Details")
        }

    }
    async function displayExpenses(val) {
        setSelectedTripName(val)
        try {
            const response = await axiosInstance.post("https://tripease-uug5.onrender.com/trip-management/displayExpenses", { selectedTripName: val})
            if (response.data.success) {
                setExpenseData(response.data.data)

            }
            else {

                message.success(response.data.message)
            }
        }
        catch (err) {

            message.error("something went wrong")
        }
    }
    
    async function selectedTripData(val) {

        setSelectedTripName(val)
        try {
            const response = await axiosInstance.post("https://tripease-uug5.onrender.com/trip-management/displaySelectedTripData", { selectedTripName: val })
            if (response.data.success) {
                setExpenseData(response.data.data)

                message.success(response.data.message)

            }
            else {

                message.success(response.data.message)
            }
        }
        catch (err) {

            message.error("something went wrong")
        }
    }
    
    /*Event handlers*/
    const handleInputChange = (event) => {
        setSearchText(event.target.value);
        setSearch(true)
    };
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            selectedTripData(searchText)
        }
    }
    
    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.leftContainer}>
                    <div className={styles.createGroupContainer}>
                        <h4>Trips</h4>
                        <span className="material-symbols-outlined" onClick={(e) => { setShowFilter(true) }}>
                            add
                        </span>
                        {showFilter && <Modal1 displayFilter setdisplayFilter={setdisplayFilter} tripname={tripname} setTripname={setTripname} closeFilter={setShowFilter} handleSubmit={handleSubmit} />}
                    </div>
                    <div className={styles.displayContainer}>
                        <input
                            className="form-control me-2"
                            type="search"
                            placeholder="Search"
                            aria-label="Search"
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress} />

                        <div >
                            {!search && tripData && tripData.map((element) =>
                            (
                                <div className={styles.trip} key={element.budgetName}>
                                    <p>{element.budgetName}</p>
                                    <div className={styles.icons}>
                                        <span className="material-symbols-outlined" onClick={() => { setBudgetNameForExpense(element.budgetName); setShowExpenseFilter(true) }}>
                                            add
                                        </span>
                                        {showExpenseFilter && <Modal2 displayExpenseFilter setdisplayExpenseFilter={setdisplayExpenseFilter} expenses={expenses} setexpenses={setexpenses} closeExpenseFilter={setShowExpenseFilter} handleExpenseSubmit={handleExpenseSubmit} />}
                                        {visibleIcons[element.budgetName]?<span className="material-symbols-outlined" onClick={() => toggleVisibilityIcon(element.budgetName)}>
                                            visibility
                                        </span>:<span class="material-symbols-outlined" onClick={() => toggleVisibilityIcon(element.budgetName)}>
                                            visibility_off
                                        </span>}
                                    </div>
                                </div>
                            ))}

                            {search &&
                                tripData &&
                                tripData.filter((element) => element.budgetName.toLowerCase().includes(searchText.toLowerCase())).map((element) =>
                                (   
                                    <div className={styles.trip}>
                                        <p >{element.budgetName}</p>
                                        <div  className={styles.icons}>
                                            <span className="material-symbols-outlined" onClick={() => { setBudgetNameForExpense(element.budgetName); setShowExpenseFilter(true) }}>
                                                add
                                            </span>
                                            {showExpenseFilter && <Modal2 displayExpenseFilter setdisplayExpenseFilter={setdisplayExpenseFilter} expenses={expenses} setexpenses={setexpenses} closeExpenseFilter={setShowExpenseFilter} handleExpenseSubmit={handleExpenseSubmit} />}
                                            <span className="material-symbols-outlined" onClick={() => { displayExpenses(element.budgetName) }}>
                                                visibility
                                            </span>
                                        </div>
                                    </div>
                                ))
                            }


                        </div>
                    </div>
                </div>
                <div className={styles.rightContainer}>
                    <div className={styles.header}>
                        <h5>History:</h5>
                    </div>
                    {expenseData && expenseData.map((element) =>
                    (
                        <div className={styles.expenseContainer} key={element.expenseName}>
                            <p>{element.expenseName}</p>
                            <p>{element.expenseAmount}</p>
                        </div >
                    ))}
                </div>
            </div>
        </>
    )
}
/* Modal to get the trip name*/
function Modal1(props) {
    props.setdisplayFilter(true)
    return (
        <>
            <div className={styles.modal1Wrapper}></div>
            <div className={styles.modal1Container}>
                <div className={styles.tripmodalcontainer}>
                    <h6 style={{ marginLeft: "-4rem", color: "black" }}>Enter Trip Name:</h6>
                    <input style={{ border: "1px solid black" }} type="text" value={props.tripname} onChange={(e) => { props.setTripname(e.target.value) }}></input>
                </div>
                <div style={{ marginTop: "-4rem" }}>
                    <button className="btn btn-danger" style={{ marginLeft: "-3rem", marginRight: "3rem" }} onClick={()=> props.closeFilter(false)}>Close</button>
                    <button className="btn btn-success" style={{ marginRight: "-3rem" }} onClick={props.handleSubmit}>Save</button>
                </div>
            </div>

        </>
    );
}

/*Modal to get the Expense Info*/
function Modal2(props) {
    props.setdisplayExpenseFilter(true)
    return (
        <>
            <div className={styles.modal1Wrapper}></div>
            <div className={styles.modal1Container}>
                <div className={styles.tripmodalcontainer}>
                    <h6 style={{ marginLeft: "-4rem", color: "black" }}>Enter Expense Name:</h6>
                    <input style={{ border: "1px solid black" }} type="text" value={props.expenses.expenseName} onChange={(e) => { props.setexpenses({ ...props.expenses, expenseName: e.target.value }) }}></input>
                    <h6 style={{ marginLeft: "-4rem", marginTop: "0.5rem", color: "black" }}>Enter Expense Amount:</h6>
                    <input style={{ border: "1px solid black" }} type="text" value={props.expenses.expenseAmount} onChange={(e) => { props.setexpenses({ ...props.expenses, expenseAmount: e.target.value }) }}></input>
                </div>
                <div style={{ marginTop: "-4rem" }}>
                    <button className="btn btn-danger" style={{ marginLeft: "-3rem", marginRight: "3rem" }} onClick={() => props.closeExpenseFilter(false)}>Close</button>
                    <button className="btn btn-success" style={{ marginRight: "-3rem" }} onClick={props.handleExpenseSubmit}>Save</button>
                </div>
            </div>

        </>
    );
}
