import React, { useEffect, useState } from "react";
import ClassCard from "./ClassCard";
import "./Classes.css";
import { useStateValue } from "./StateProvider";
import { Link } from "react-router-dom";
import db from "./firebase";
import { actionTypes } from "./Reducer";

function Classes() {
  const [{ user, classes, font, pallet, url }, dispatch] = useStateValue();
  var data = [];
  var preferenceData = [];

  async function fetchData() {
    await user?.uid;
    
    // Classes have not been pulled
    if (classes.length == 0) {
      db.collection("users")
      .doc(user?.uid)
      .collection("classes")
      .get()
      .then((querrySnapshot) => {
        // Push all of the data to the data variable
        querrySnapshot.forEach((doc) => {
          data.push(doc.data());

          // Set the current classes
          dispatch({
            type: actionTypes.SET_CLASSES,
            classes: data,
          });
        });
      });
    }
    
    // Project just restarted
    if (font == "" && url == "" && pallet == 1) {
      db.collection('users')
        .doc(user?.uid)
        .collection("preferences")
        .get()
        .then((querrySnapshot) => {
          querrySnapshot.forEach((doc) => {
            preferenceData.push(doc.data());

              // Push preferences to data layer
              dispatch({
                type: actionTypes.UPDATE_FONT,
                font: preferenceData[0].font,
              })

              dispatch({
                type: actionTypes.UPDATE_PALLET,
                pallet: preferenceData[0].pallet,
              })

              dispatch({
                type: actionTypes.UPDATE_URL,
                url: preferenceData[0].url,
              })
          })
        })
      }
  };

  useEffect(() => {
    // Get data from db and push to data layer
    fetchData();
  }, [user]);

  return (
    <div className="classes">
      {classes.length == 0 ? (
        <div className="classes__noClass">
          <div className="classes__container">
              <Link className="classes__newClassBtn" to="/new-task">
                  <h3>Add Class</h3>
              </Link>
            <h5>Please add a class to begin organizing your schedule!</h5>
          </div>
        </div>
      ) : null}
      
      <div className="classes__grid">
        {classes.map((course) => (
          <ClassCard
            id={course.id}
            link={course.link}
            name={course.name}
            teacher={course.teacher}
            todo={course.todo}
            key={course.id}
          />
        ))}
      </div>
    </div>
  );
}

export default Classes;
