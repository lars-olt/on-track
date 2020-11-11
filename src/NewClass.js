import React, { useState } from "react";
import "./NewClass.css";
import Button from "@material-ui/core/Button";
import ClassIcon from "@material-ui/icons/Class";
import PersonIcon from "@material-ui/icons/Person";
import LinkIcon from "@material-ui/icons/Link";
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import { useStateValue } from "./StateProvider";
import db from "./firebase";
import { useHistory } from "react-router-dom";
import { actionTypes } from "./Reducer";

function NewClass() {
  const [name, setName] = useState("");
  const [teacher, setTeacher] = useState("");
  const [link, setLink] = useState("");
  const [task, setTask] = useState("");
  const [{ user }, dispatch] = useStateValue();
  const [tasks, setTasks] = useState([]);

  // Temporarily holds the task object to be added to the tasks array
  var taskObject = {};

  const history = useHistory();
  const shortid = require("shortid");
  var Filter = require("bad-words"),
    filter = new Filter();

  const submit = async (e) => {
    e.preventDefault();
    await user?.uid;

    const docId = shortid.generate();

    // Create new data structure
    const docData = {
      name: name,
      teacher: teacher,
      link: link,
      todo: tasks,
      id: docId,
    };

    // Add to data layer
    dispatch({
      type: actionTypes.ADD_CLASS,
      class: docData,
    });

    // Add new task to firestore
    db.collection("users")
      .doc(user?.uid)
      .collection("classes")
      .doc(docId)
      .set(docData)
      .then(
        // Add to state classes
        history.push("/home")
      );
  };

  // Add new task to tasks array
  const updateTasks = (e) => {
    e.preventDefault();

    taskObject = {
      task: task,
      clicked: false,
      id: shortid.generate(),
      timestamp: new Date(),
    };
    
    setTasks([...tasks, taskObject]);

    setTask("");
  };

  return (
    <div className="newTask">
      <div className="newTask__container">
        <small>Add Class</small>
        <hr />
        <br />
        <div className="newTask__input">
          <ClassIcon />
          <input
            className="newTask__inputField"
            value={name}
            type="text"
            placeholder="Class Name"
            onChange={(e) => setName(filter.clean(e.target.value))}
            required
          />
        </div>
        <div className="newTask__input">
          <PersonIcon />
          <input
            className="newTask__inputField"
            value={teacher}
            type="text"
            placeholder="Teacher Name"
            onChange={(e) => setTeacher(filter.clean(e.target.value))}
            required
          />
        </div>
        <div className="newTask__input">
          <LinkIcon />
          <input
            className="newTask__inputField"
            value={link}
            type="text"
            placeholder="Link to class"
            onChange={(e) => setLink(filter.clean(e.target.value))}
            required
          />
        </div>
        <div className="newTask__tasks">
          <small>Todo:</small>
          <ul>
            {tasks.map((item) => (
              <li key={shortid.generate()}>
                <small>{item.task}</small>
              </li>
            ))}
          </ul>
        </div>
        <div className="newTask__input newTask__addTask">
          <form className="newTask__form" onSubmit={updateTasks}>
            <input
              className="newTask__inputField"
              value={task}
              type="text"
              placeholder="Add todo"
              onChange={(e) => setTask(filter.clean(e.target.value))}
              required
            />
            <IconButton className="newTask__addTaskBtn" type="submit">
              <AddIcon />
            </IconButton>
          </form>
        </div>
        <Button className="newTask__btn" onClick={submit}>
          Add Class
        </Button>
      </div>
    </div>
  );
}

export default NewClass;
