import React, { useEffect, useState } from "react"
import styles from "./SplitExpense.module.css"
import axiosInstance from "../../interceptors/interceptor"
import Navbar from "../navbar/Navbar"
import Modal from '@mui/material/Modal';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';

const SplitExpense = () => {
    const [groups, setGroups] = useState([]);
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [groupSearch, setGroupSearch] = useState('');
    const [groupDetailsData, setgroupDetailsData] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState()

    const [viewUserModelSearch, setViewUserModelSearch] = useState('')
    const [filteredViewGroupUsers, setFilteredViewGroupUsers] = useState([])

    useEffect(() => {
        if (groupDetailsData.length) {
            if (viewUserModelSearch.length) {
                let filteredGroupUsers = groupDetailsData.filter(data => data.user.name.toLowerCase().includes(viewUserModelSearch.toLowerCase()))
                setFilteredViewGroupUsers([...filteredGroupUsers])
            }
            else {
                setFilteredViewGroupUsers([...groupDetailsData])
            }
        }
        else
            setFilteredViewGroupUsers([])
    }, [groupDetailsData, viewUserModelSearch])

    useEffect(() => {
        fetchGroups()
    }, [])

    useEffect(() => {
        if (groups.length) {
            if (groupSearch.length) {
                let filteredGroups = groups.filter(data => data.name.toLowerCase().includes(groupSearch.toLowerCase()))
                setFilteredGroups([...filteredGroups])
            }
            else {
                setFilteredGroups([...groups])
            }
        }
        else
            setFilteredGroups([])
    }, [groups, groupSearch])

    useEffect(() => {
        onSplitDialogClose()
        if (selectedGroup) {
            getHistoryData()
            getTotalsData()
        }
    }, [selectedGroup])

    //Modal Variables

    const [addGroupsOpen, setAddGroupsOpen] = useState(false);
    const [groupDialogOpen, setGroupDialogOpen] = useState(false);
    const [addExpenseOpen, setAddExpenseOpen] = useState(false);

    let splitTypes = {
        equally: "equally",
        share: "share",
        amount: "amount"
    }
    const [splitType, setSplitType] = useState(splitTypes.equally)
    const [paidBy, setPaidBy] = useState()

    //Model Functions

    const handleOpen = (key, data = null) => {
        if (key === "add-group")
            onAddGroupModelClick()
        else if (key === "group-details") {
            groupDetails(data)
            setGroupDialogOpen(true)
        }
        else if (key === "add-expense")
            addExpenseClick()
    };

    const handleClose = (key, reason) => {
        if (reason && reason === "backdropClick" && "escapeKeyDown")
            return;
        if (key === "add-group")
            onAddGroupDialogClose();
        else if (key === "group-details") {
            setgroupDetailsData([])
            setGroupDialogOpen(false)
        }
        else if (key === "add-expense")
            onSplitDialogClose()
    };

    //Add group model logic
    const [addGroupUsers, setaddGroupUsers] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [addUserModelSearch, setAddUserModelSearch] = useState('')
    const [filteredAddGroupUsers, setFilteredAddGroupUsers] = useState([])

    useEffect(() => {
        if (addGroupUsers.length) {
            if (addUserModelSearch.length) {
                let filteredGroupUsers = addGroupUsers.filter(data => data.name.toLowerCase().includes(addUserModelSearch.toLowerCase()))
                setFilteredAddGroupUsers([...filteredGroupUsers])
            }
            else {
                setFilteredAddGroupUsers([...addGroupUsers])
            }
        }
        else
            setFilteredAddGroupUsers([])
    }, [addGroupUsers, addUserModelSearch])

    const onAddGroupModelClick = () => {
        setAddGroupsOpen(true);
        fetchAllUsers()
    }

    const onUserCheckboxClick = (user) => {
        let users = [...selectedUsers]
        if (selectedUsers.find(data => data._id === user._id)) {
            users = selectedUsers.filter(data => data._id !== user._id)
        }
        else {
            users.push(user)
        }
        setSelectedUsers([...users])
    }

    const onAddGroupDialogSave = () => {
        if (!groupName || !groupName.length) {
            toast.warning("Please enter the group name")
            return
        }

        if (!selectedUsers.length) {
            toast.warning("Please select atleast one user")
            return
        }

        let params = {
            groupName: groupName,
            users: selectedUsers.map(data => data._id)
        }
        addGroup(params)

    }

    const onAddGroupDialogClose = () => {
        setAddGroupsOpen(false);
        setaddGroupUsers([])
        setGroupName('')
        setSelectedUsers([])
    }

    //Add Expense Dialog Section
    const [paidAmount, setPaidAmount] = useState(0);
    const [paidReason, setPaidReason] = useState('');
    const [expenseGroupUsers, setExpenseGroupUsers] = useState([{ name: '', _id: '' }])
    const [selectedUsersInExpense, setSelectedUsersInExpense] = useState([])
    const [perSplitEqually, setperSplitEqually] = useState(0)
    const [splitLoad, setSplitLoad] = useState(false)
    const [shareDict, setShareDict] = useState({})

    const [expenseUserModelSearch, setExpenseUserModelSearch] = useState('')
    const [filteredExpenseGroupUsers, setFilteredExpenseGroupUsers] = useState([])

    useEffect(() => {
        if (expenseGroupUsers.length) {
            if (expenseUserModelSearch.length) {
                let filteredGroupUsers = expenseGroupUsers.filter(data => data.name.toLowerCase().includes(expenseUserModelSearch.toLowerCase()))
                setFilteredExpenseGroupUsers([...filteredGroupUsers])
            }
            else {
                setFilteredExpenseGroupUsers([...expenseGroupUsers])
            }
        }
        else
            setFilteredExpenseGroupUsers([])
    }, [expenseGroupUsers, expenseUserModelSearch])

    const addExpenseClick = () => {
        groupUsers()
        setAddExpenseOpen(true)
    }

    const onPaidByUserChange = (event) => {
        setPaidBy(event.target.value);
    };

    const onSplitTypeClick = (event) => {
        setSplitType(event.target.value)
    }

    const getDisabledStatus = () => {
        let types = [splitTypes.share, splitTypes.equally]
        if (types.includes(splitType)) {
            return true
        }
        return false
    }

    const onExpenseUserCheckboxClick = (user) => {
        let users = [...selectedUsersInExpense]
        if (selectedUsersInExpense.find(data => data === user._id)) {
            users = selectedUsersInExpense.filter(data => data !== user._id)
        }
        else {
            users.push(user._id)
        }
        setSelectedUsersInExpense([...users])
    }

    useEffect(() => {
        manageExpenses()
    }, [selectedUsersInExpense, shareDict, splitType])

    const addShareToUser = (user, event) => {
        let value = event.target.value;
        if (!value)
            value = 0
        let presentDict = { ...shareDict }
        presentDict[user._id] = (+value)
        setShareDict(presentDict)
    }

    const manageExpenses = (event = {}, userDoc = {}) => {
        setSplitLoad(true)
        let amount = paidAmount
        if (splitType === splitTypes.equally) {
            let splitNo = selectedUsersInExpense.length
            let perSplit = amount / splitNo
            let users = expenseGroupUsers.map(user => {
                if (selectedUsersInExpense.includes(user._id)) {
                    user.amount = Math.round(perSplit)
                    return user
                }
                user.amount = 0
                return user
            })
            setExpenseGroupUsers(users)
            setperSplitEqually(perSplit)
        }
        if (splitType === splitTypes.share) {
            if (!shareDict)
                return
            let totalShares = Object.values(shareDict).reduce((acc, curr) => acc + curr, 0)
            let amountPerShare = amount / totalShares
            let users = expenseGroupUsers.map(user => {
                if (shareDict[user._id]) {
                    user.amount = Math.round(amountPerShare * shareDict[user._id])
                    return user
                }
                user.amount = 0
                return user
            })
            setExpenseGroupUsers(users)
            setperSplitEqually(amountPerShare)
        }
        if (splitType === splitTypes.amount) {
            if (!event.target)
                return
            let value = event.target.value
            if (!value)
                value = 0
            let users = expenseGroupUsers.map(user => {
                if (userDoc._id === user._id) {
                    user.amount = value
                }
                return user
            })
            setExpenseGroupUsers(users)
            setperSplitEqually(value)
        }
    }

    const addExpense = () => {
        let splitDetails = expenseGroupUsers.map(data => {
            if (data.amount && data.amount > 0) {
                return {
                    userId: data._id,
                    amount: data.amount
                }
            }
            return null
        }).filter(data => data)
        let params = {
            paidBy: paidBy,
            splitDetails,
            paidReason,
            paidAmount,
            group: selectedGroup
        }
        addSplit(params)
    }

    useEffect(() => {
        setSplitLoad(false)
    }, [expenseGroupUsers, perSplitEqually])

    const onSplitDialogClose = () => {
        setAddExpenseOpen(false);
        setExpenseGroupUsers([])
        setSelectedUsersInExpense([])
        setPaidReason('')
        setPaidAmount(0)
        setPaidBy('')
        setperSplitEqually(0)
        setSplitLoad(false)
        setShareDict({})
    }

    //Main Content Logic
    const [historyData, setHistoryData] = useState([])
    const [totalsData, setTotalsData] = useState({
        balance: 0,
        owe: 0,
        owed: 0
    })


    //Api Calls to interact with backend

    const getHistoryData = async () => {
        try {
            let params = {
                group: selectedGroup
            }
            const response = await axiosInstance.get('https://tripease-uug5.onrender.com/expense-management/history-data', { params })
            if (response.data.data) {
                let data = response.data.data.map(doc => {
                    doc['displayDate'] = moment(doc.createdAt).format('MMMM Do YYYY, h:mm:ss a');
                    return doc
                })
                setHistoryData(data)
            }
        }
        catch (err) {
            if (err.response)
                toast.error(err.response.data.message)
        }

    }

    const getTotalsData = async () => {
        try {
            let params = {
                group: selectedGroup
            }
            const response = await axiosInstance.get('https://tripease-uug5.onrender.com/expense-management/user-totals', { params })
            if (response.data.data)
                setTotalsData(response.data.data)
        }
        catch (err) {
            if (err.response)
                toast.error(err.response.data.message)
        }

    }

    const fetchGroups = async () => {
        try {
            const response = await axiosInstance.get('https://tripease-uug5.onrender.com/expense-management/user-groups', {})
            if (response.data.data)
                setGroups(response.data.data)
        }
        catch (err) {
            if (err.response)
                toast.error(err.response.data.message)
        }

    }

    const fetchAllUsers = async () => {
        try {
            const response = await axiosInstance.get('https://tripease-uug5.onrender.com/expense-management/users', {})
            let users = response.data.data.map(data => {
                data['selected'] = false
                return data
            })

            setaddGroupUsers(users)
        }
        catch (err) {
            if (err.response)
                toast.error(err.response.data.message)
        }

    }

    const addGroup = async (params) => {
        try {
            await axiosInstance.post('https://tripease-uug5.onrender.com/expense-management/user-groups', params)
            fetchGroups()
            onAddGroupDialogClose()

        }
        catch (err) {
            if (err.response)
                toast.error(err.response.data.message)
        }

    }

    const deleteGroup = async (group) => {
        let params = {
            group: group._id
        }
        try {
            await axiosInstance.put('https://tripease-uug5.onrender.com/expense-management/delete-group', params)
            fetchGroups()
        }
        catch (err) {
            if (err.response)
                toast.error(err.response.data.message)
        }

    }

    const groupDetails = async (group) => {
        let params = {
            group: group._id
        }
        try {
            let response = await axiosInstance.get('https://tripease-uug5.onrender.com/expense-management/group-details', { params })
            if (response.data.data)
                setgroupDetailsData(response.data.data)
        }
        catch (err) {
            if (err.response)
                toast.error(err.response.data.message)
        }

    }

    const groupUsers = async () => {
        let params = {
            group: selectedGroup
        }
        try {
            let response = await axiosInstance.get('https://tripease-uug5.onrender.com/expense-management/group-users', { params })
            if (response.data.data) {
                let users = response.data.data.map(data => {
                    data['amount'] = 0
                    data['noOfShares'] = 0
                    return data
                })
                setExpenseGroupUsers(users)
                setPaidBy(expenseGroupUsers[0]._id)
            }
        }
        catch (err) {
            if (err.response)
                toast.error(err.response.data.message)
        }
    }

    const addSplit = async (params) => {
        try {
            await axiosInstance.post('https://tripease-uug5.onrender.com/expense-management/add-split', params)
            onSplitDialogClose()
            getHistoryData()
            getTotalsData()
        }
        catch (err) {
            if (err.response)
                toast.error(err.response.data.message)
        }

    }

    return (
        <>
        <Navbar/>
            <ToastContainer />
            <div className={styles.container}>
                <div className={styles.groupContainer}>
                    <div className={styles.groupsHeading}>
                        <div></div>
                        <div>
                            Groups
                        </div>
                        <span className="material-symbols-outlined icon" style={{ cursor: "pointer" }} onClick={() => handleOpen("add-group")}>
                            add
                        </span>
                    </div>
                    <div className={styles.groupsSection}>
                        <div className={styles.searchContainer}>
                            <input type="text" placeholder="Search Groups" value={groupSearch} onChange={(event) => setGroupSearch(event.target.value)} className={styles.searchBar} />
                        </div>
                        <div className={styles.groupElementsContainer}>
                            {filteredGroups.length && filteredGroups.map((element) =>
                            (
                                <div className={styles.groupElement} style={(element._id === selectedGroup) ? { backgroundColor: "#ffca2c", color: "black" } : {}} key={element._id} onClick={() => { setSelectedGroup(element._id) }}>
                                    {element.name}
                                    <div style={{ display: "flex", gap: "5px" }}>
                                        <span className="material-symbols-outlined icon" style={{ cursor: "pointer" }} onClick={(event) => { event.stopPropagation(); deleteGroup(element) }}>
                                            delete
                                        </span>
                                        <span className="material-symbols-outlined icon" style={{ cursor: "pointer" }} onClick={(event) => { event.stopPropagation(); handleOpen("group-details", element) }}>
                                            info
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {
                    selectedGroup &&
                    <div className={styles.contentContainer}>
                        <div className={styles.buttonSection}>
                            <div></div>
                            <div className={styles.contentHeaderText}>Transactions and Details</div>
                            <button className="btn" style={{border:"2px solid #ffca2c",color:"white"}} onClick={() => handleOpen("add-expense")}>Add Expense</button>
                        </div>
                        <div className={styles.contentHeader}>
                            <div className={styles.headerElementContainer} style={{border:"2px solid #ffca2c" }}>
                                <div>
                                    Total Balance
                                </div>
                                <div>{totalsData.balance}</div>
                            </div>
                            <div className={styles.headerElementContainer} style={{ border:"2px solid #ffca2c"}}>
                                <div>
                                    You Owe
                                </div>
                                <div>{totalsData.owe}</div>

                            </div>
                            <div className={styles.headerElementContainer} style={{ border:"2px solid #ffca2c" }}>
                                <div>
                                    You are owed
                                </div>
                                <div>{totalsData.owed}</div>

                            </div>
                        </div>
                        <div className={styles.historyContainer}>
                            <div className={styles.historyHeaderSection}>History :</div>
                            <div className={styles.historyContentSection}>
                                {
                                    historyData && historyData.map(data => {
                                        return (
                                            <div className={styles.historyElement} key={historyData._id}>
                                                <div className={styles.historyElementDetails}>
                                                    {data?.displayDate}
                                                </div>
                                                <div className={styles.historyElementDetails}>
                                                    {data?.paidBy?.name}
                                                </div>
                                                <div className={styles.historyElementDetails}>
                                                    {data?.reason}
                                                </div>
                                                <div className={styles.historyAmountDetails}>
                                                    {data?.amount}
                                                    <span className={`material-symbols-outlined`} style={{ color: "red" }}>
                                                        north_east
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                }
            </div>

            {/* Add Group Modal */}
            <Modal
                open={addGroupsOpen}
                onClose={(event, reason) => handleClose("add-group", reason)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className={styles.addGroupsDialogModal}>
                    <div className={styles.modelHeaderContainer}>
                        <div></div>
                        <div className={styles.modelHeader}>Add Group</div>
                        <div>
                            <span className="material-symbols-outlined" style={{ cursor: "pointer" }} onClick={() => handleClose("add-group")}>
                                close
                            </span>
                        </div>
                    </div>
                    <div className={styles.addGroupDialogContent}>
                        <div className={styles.groupNameContainer}>
                            <p style={{ fontWeight: "600" ,color:"grey"}}> Group Name :</p>
                            <div > <input type="text" style={{ width: "500px", borderRadius: "5px", border: "1px solid grey", padding: "5px" }} onChange={(e) => setGroupName(e.target.value)} /></div>
                        </div>
                        <div className={styles.groupMembersContainer}>
                            <div style={{ fontWeight: "600" ,color:"grey"}}> Members </div>

                            <div className={styles.groupsContainer}>
                                <div className={styles.searchContainer}>
                                    <input type="text" placeholder="Search Users" value={addUserModelSearch} onChange={(event) => setAddUserModelSearch(event.target.value)} className={styles.searchBar} />
                                </div>
                                <div className={styles.usersContainer}>
                                    {filteredAddGroupUsers.length && filteredAddGroupUsers.map((user) =>
                                    (
                                        <div className={styles.groupUserElement} key={user._id}>
                                            <div style={{color:"grey"}}>{user.name}</div>
                                            <div><input type="checkbox" onChange={() => onUserCheckboxClick(user)} /></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.modalButtonGroup}>
                        <button className="btn btn-danger p-1" onClick={() => handleClose("add-group")}>Cancel</button>
                        <button className="btn btn-success p-1" onClick={() => onAddGroupDialogSave()}>Submit</button>
                    </div>
                </div>
            </Modal>


            {/* View Group Details Modal */}
            <Modal
                open={groupDialogOpen}
                onClose={(event, reason) => handleClose("group-details", reason)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className={styles.showGroupsDialogModal}>
                    <div className={styles.modelHeaderContainer}>
                        <div></div>
                        <div className={styles.modelHeader}>Group Details</div>
                        <div>
                            <span className="material-symbols-outlined" style={{ cursor: "pointer" }} onClick={() => handleClose("group-details")}>
                                close
                            </span>
                        </div>
                    </div>
                    <div className={styles.addGroupDialogContent}>
                        <div className={styles.groupMembersContainer}>

                            <div className={styles.groupsContainer}>
                                <div className={styles.searchContainer}>
                                    <input type="text" placeholder="Search Users" value={viewUserModelSearch} onChange={(event) => setViewUserModelSearch(event.target.value)} className={styles.searchBar} />
                                </div>
                                <div className={styles.usersContainer}>
                                    {filteredViewGroupUsers && filteredViewGroupUsers.map((groupDetail) =>
                                    (
                                        <div className={styles.groupUserElement} key={groupDetail._id}>
                                            <div style={{color:"grey"}}>{groupDetail.user.name}</div>
                                            <div>{groupDetail.balance}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.modalButtonGroup}>
                        <button className="btn btn-danger px-3 " style={{ fontSize: "12px" }} onClick={() => handleClose("group-details")}>Cancel</button>
                    </div>
                </div>
            </Modal>

            {/* Add Expense Modal */}
            <Modal
                open={addExpenseOpen}
                onClose={(event, reason) => handleClose("add-expense", reason)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className={styles.addGroupsDialogModal}>
                    <div className={styles.modelHeaderContainer}>
                        <div></div>
                        <div className={styles.modelHeader}>Add Expense</div>
                        <div>
                            <span className="material-symbols-outlined" style={{ cursor: "pointer" }} onClick={() => handleClose("add-expense")}>
                                close
                            </span>
                        </div>
                    </div>
                    <div className={styles.addGroupDialogContent}>
                        <div className={styles.groupNameContainer}>
                            <div className={styles.groupNameElementsCopntainer}>
                                <div style={{ fontWeight: "600" }}> Paid By :</div>
                                <div style={{ width: "60%" }}>
                                    <FormControl fullWidth={true}>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={paidBy ?? ''}
                                            onChange={onPaidByUserChange}
                                        >
                                            {
                                                expenseGroupUsers.length && expenseGroupUsers.map(user =>
                                                    <MenuItem key={user._id} value={user._id}>{user.name}</MenuItem>
                                                )
                                            }
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                            <div className={styles.groupNameElementsCopntainer}>
                                <div style={{ fontWeight: "600" }}> Amount :</div>
                                <div>
                                    <input type="number" value={paidAmount} onChange={(e) => { setPaidAmount(e.target.value) }} style={{ width: "200px", borderRadius: "5px", border: "1px solid grey", padding: "5px" }} />
                                </div>
                            </div>
                        </div>
                        <div className={styles.groupNameContainer}>
                            <div style={{ fontWeight: "600" }}> Reason :</div>
                            <div>
                                <input type="text" value={paidReason} onChange={(e) => { setPaidReason(e.target.value) }} style={{ width: "500px", borderRadius: "5px", border: "1px solid grey", padding: "5px" }} />
                            </div>
                        </div>
                        <div className={styles.groupNameContainer}>
                            <div style={{ fontWeight: "600" }}> Split Type :</div>
                            <div>
                                <FormControl>
                                    <RadioGroup
                                        aria-labelledby="demo-controlled-radio-buttons-group"
                                        name="controlled-radio-buttons-group"
                                        value={splitType}
                                        onChange={onSplitTypeClick}
                                        style={{ display: "flex", flexDirection: "row" }}
                                    >
                                        <FormControlLabel value={splitTypes.equally} control={<Radio />} label="Equally" className={styles.labelStyling} />
                                        <FormControlLabel value={splitTypes.share} control={<Radio />} label="By Share" className={styles.labelStyling} />
                                        <FormControlLabel value={splitTypes.amount} control={<Radio />} label="By Amount" className={styles.labelStyling} />
                                    </RadioGroup>
                                </FormControl>
                            </div>
                        </div>
                        <div className={styles.groupMembersContainer}>
                            <div style={{ fontWeight: "600" }}> Amount Distribution </div>

                            <div className={styles.groupsContainer}>
                                <div className={styles.searchContainer}>
                                    <input type="text" placeholder="Search Users" value={expenseUserModelSearch} onChange={(event) => setExpenseUserModelSearch(event.target.value)} className={styles.searchBar} />
                                </div>
                                <div className={styles.usersContainer}>
                                    {
                                        filteredExpenseGroupUsers.length && filteredExpenseGroupUsers.map(user => {
                                            return (<div key={user._id}>
                                                {
                                                    splitType === splitTypes.equally &&
                                                    <div className={styles.groupUserElement}>
                                                        <div style={{ marginRight: "10px" }}>
                                                            <input type="checkbox" onChange={() => onExpenseUserCheckboxClick(user)} />
                                                        </div>
                                                        <div>{user.name}</div>
                                                        {!splitLoad && <div><input value={user.amount} disabled={getDisabledStatus()} type="number" style={{ width: "500px", borderRadius: "5px", border: "1px solid grey", padding: "5px" }} /></div>}
                                                    </div>
                                                }
                                                {
                                                    splitType === splitTypes.share &&
                                                    <div className={styles.groupUserElement}>
                                                        <div style={{ width: "300px" }}>{user.name}</div>
                                                        <div><input placeholder="Enter no of shares" value={shareDict[user._id]} onChange={(event) => addShareToUser(user, event)} type="number" style={{ width: "200px", borderRadius: "5px", border: "1px solid grey", padding: "5px", marginRight: "20px" }} /></div>
                                                        {!splitLoad && <div><input value={user.amount} disabled={getDisabledStatus()} type="number" style={{ width: "200px", borderRadius: "5px", border: "1px solid grey", padding: "5px" }} /></div>}
                                                    </div>
                                                }
                                                {
                                                    splitType === splitTypes.amount &&
                                                    <div className={styles.groupUserElement}>
                                                        <div>{user.name}</div>
                                                        <div><input value={user.amount} disabled={getDisabledStatus()} onChange={(event) => { manageExpenses(event, user) }} type="number" style={{ width: "500px", borderRadius: "5px", border: "1px solid grey", padding: "5px" }} /></div>
                                                    </div>
                                                }
                                            </div>)
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.modalButtonGroup}>
                        <button className="btn btn-danger p-1" onClick={() => handleClose("add-expense")}>Cancel</button>
                        <button className="btn btn-success p-1" onClick={() => addExpense()}>Submit</button>
                    </div>
                </div>
            </Modal>
        </>


    )
}
export default SplitExpense
