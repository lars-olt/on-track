import React, { useState, useEffect } from "react";
import LaunchIcon from "@material-ui/icons/Launch";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import { useStateValue } from "./StateProvider";
import shortId from "shortid";
import db from "./firebase";
import "./ClassCard.css";
import Task from "./Task";

function ClassCard({ id, link, name, teacher, todo }) {
  const [newTask, setNewTask] = useState("");
  const [{ user, classes, preferences }, dispatch] = useStateValue();

  var course = classes.find((item) => item.id === id);
  var Filter = require("bad-words"),
    filter = new Filter();

  // Get the course object from state
  useEffect(() => {
    course = classes.find((item) => item.id === id);
  }, [classes]);

  var classRef = db
    .collection("users")
    .doc(user?.uid)
    .collection("classes")
    .doc(id);

  const removeCard = async (e) => {
    e.preventDefault();

    // Handle removing the card
    await user?.uid;

    classRef.delete();

    dispatch({
      type: "DELETE_CLASS",
      id: id,
    });
  };

  const addTask = (e) => {
    e.preventDefault();
    if (newTask != "") {
      var tempTodo = todo;

      tempTodo.push({
        clicked: false,
        id: shortId.generate(),
        task: filter.clean(newTask),
        timestamp: new Date(),
      });

      // Handle adding newTask
      classRef.update({
        todo: tempTodo,
      });
    }

    setNewTask("");
  };

  const getTodo = () => {
    if (course.todo) {
      return (
        <>
          {course.todo.map((item) => (<Task item={item} todo={todo} classRef={classRef} id={id} />))}
        </>
      )
    } else {
      return null;
    }
  };

  return (
    <div className="classCard">
      <div className="classCard__header">
        <h2 className="classCard__class">{name}</h2>

        <div className="classCard__remove">
          <DeleteIcon className="classCard__removeBtn" onClick={removeCard} />
        </div>
      </div>

      <div className="classCard__launch">
        <h5 className="classCard__teacher">{teacher}</h5>
        <a href={link} target="_blank" rel="noopener noreferrer">
          <LaunchIcon className="icon" />
        </a>
      </div>

      <div className="classCard__list">
        <h3>To-Do:</h3>
        <div className="classCard__listItems">{getTodo()}</div>
      </div>

      <div className="classCard__addItem">
          <form>
            <IconButton
              className="classCard__addBtn"
              type="submit"
              onClick={addTask}
            >
              <AddIcon />
            </IconButton>
            <input
              type="text"
              placeholder="Add task"
              value={newTask}
              onChange={(e) => {
                setNewTask(e.target.value);
              }}
            />
          </form>
        </div>
    </div>
  );

  };

export default ClassCard;
