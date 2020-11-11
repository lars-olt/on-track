import React, { useState, useEffect } from 'react'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import DeleteIcon from '@material-ui/icons/Delete';
import StopIcon from '@material-ui/icons/Stop';
import shortId from "shortid";
import { useStateValue } from './StateProvider';
import './Task.css';

function Task({ item, todo, classRef, id }) {
    const [open, setOpen] = useState(false);
    const [marked, setMarked] = useState(false);
    const [currentPallet, setCurrentPallet] = useState([""]);
    const [{ pallet }, dispatch] = useStateValue();

    const handleClick = () => {
        setOpen((prev) => !prev);
    }

    const handleClose = () => {
        setOpen(false);
    }

    // Check if the task has been in the db longer than 2 days
    const checkOld = (clicked) => {
        if (item.timestamp) { // Timestamp exists
            // Task has been clicked and is 2 or more days old
            const currentDate = new Date();

            const oneDay = 24 * 60 * 60 * 1000; // hrs*min*sec*milisec

            var numberDays = Math.round(Math.abs((currentDate - item.timestamp) / oneDay));

            if (clicked && numberDays >= 2) {
                setMarked(false);
                removeTask();
            }
        }
    }

    const toggleCheckbox = (item) => {
        var tempTodo = todo;

        // Get the index of the task to remove
        const checkId = (testTask) => {
            return testTask.id === item.id;
        };

        // Set index
        var index = tempTodo.findIndex(checkId);

        // Update the old task
        tempTodo[index] =
        {
            task: item.task,
            id: item.id,
            clicked: !item.clicked,
            timestamp: item.timestamp,
        };

        // Update db
        classRef.update({
            todo: tempTodo,
        });

        dispatch({
            type: "UPDATE_TASK",
            taskId: id,
            newTodo: tempTodo,
        });
    };
    
    const removeTask = () => {
        var tempTodo = todo;

        // Get the index of the task to remove
        var checkId = (testTask) => {
            return testTask.id === item.id;
        };

        // Set index
        var index = tempTodo.findIndex(checkId);

        // Remove the old task from the array
        tempTodo.splice(index, 1);

        // Remove any marks
        setMarked(false);

        // Remove from db
        classRef.update({
            todo: tempTodo,
        });

        dispatch({
            type: "UPDATE_TASK",
            taskId: id,
            newTodo: tempTodo,
        });
    }

    const markTask = (item, color) => {
        var tempTodo = todo;

        // Get the index of the task to remove
        const checkId = (testTask) => {
            return testTask.id === item.id;
        };

        // Set index
        const index = tempTodo.findIndex(checkId);

        // Get the current task
        var currentTask = tempTodo[index];

        // Get the current bg color
        var darkColor = "";

        // Get the matching accent color
        switch (color) {
            case "rgb(248,237,167)":
                darkColor = "rgb(255, 221, 0)";
                break;
            case "rgb(250,203,216)":
                darkColor = "rgb(255, 80, 130)";
                break;
            case "rgb(187,225,247)":
                darkColor = "rgb(97, 197, 255)";
                break;
            case "rgb(252,205,166)":
                darkColor = "rgb(255, 160, 82)";
                break;
            case "rgb(230,210,228)":
                darkColor = "rgb(226, 122, 216)";
                break;
            case "rgb(218,238,245)":
                darkColor = "rgb(56, 192, 241)";
                break;
            case "rgb(205,230,192)":
                darkColor = "rgb(141, 228, 94)";
                break;
            case "rgb(251,210,194)":
                darkColor = "rgb(247, 120, 71)";
                break;
            case "rgb(249,200,202)":
                darkColor = "rgb(243, 85, 90)";
                break;
            default:
                break;
        }

        // Update the marked color
        currentTask.color = { color, darkColor }

        // Update the db
        classRef.update({
            todo: tempTodo,
        });

        // Update the task in the data layer
        dispatch({
            type: "UPDATE_TASK",
            taskId: id,
            newTodo: tempTodo,
        });
    }

    useEffect(() => {
        if (item.timestamp) { // If a timestamp exists
            const currentDate = new Date();

            const oneDay = 24 * 60 * 60 * 1000; // hrs*min*sec*milisec

            var numberDays = Math.round(Math.abs((currentDate - item.timestamp) / oneDay));

            if (item.timestamp.toDate) {
                numberDays = Math.round(Math.abs((currentDate - item.timestamp.toDate()) / oneDay));
            }

            // If the task is 1 or more days old
            if (numberDays >= 1) {
                setMarked(true);
            }

            // Check if the task has been in the db for longer than 2 days
            checkOld(item.clicked);
        }

        // Set the current color pallet
        switch (pallet[0]) {
            case 1:
                setCurrentPallet(["rgb(248,237,167)", "rgb(250,203,216)", "rgb(187,225,247)"]);
                break;
        
            case 2:
                setCurrentPallet(["rgb(252,205,166)", "rgb(230,210,228)", "rgb(218,238,245)"]);
                break;
        
            case 3:
                setCurrentPallet(["rgb(205,230,192)", "rgb(251,210,194)", "rgb(249,200,202)"]);
                break;
        
            default:
                // The pallet is undefined
                break;
        }
    }, [pallet]);

    return (
        <div className="task">
            <div className="task__listItem" key={shortId.generate()}>
                <input
                    type="checkbox"
                    checked={item.clicked}
                    onChange={(e) => {
                        e.preventDefault();
                        toggleCheckbox(item);
                    }}
                    key={shortId.generate()}
                />
                <div className="task__listInfo" style={item.color != "" || item.color != undefined ? ({ borderLeftColor: item.color?.darkColor, backgroundColor: item.color?.color }) : ({ borderLeftColor: "white" })}>
                    {marked && !item.clicked ? (
                        <h2 className="task__taskMark">*</h2>
                    ) : null}
                    <h4>{item.task}</h4>
                    <ClickAwayListener onClickAway={handleClose}>
                        <MoreVertIcon className="task__editTask" onClick={handleClick} />
                    </ClickAwayListener>
                </div>
                {open ? (
                    // Dropdown
                    <div className="task__sidebar">
                        {currentPallet.map((color) => (
                            <StopIcon className="task__sidebarColor" style={{ color: color }} onClick={(e) => { e.preventDefault(); markTask(item, color); }} />
                        ))}
                        <DeleteIcon className="task__sidebarDelete" onClick={(e) => { e.preventDefault(); removeTask();}}/>
                    </div>
                ) : null}
            </div>
        </div>
    )
}

export default Task;
