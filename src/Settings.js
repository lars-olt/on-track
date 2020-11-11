import React, { useState, useEffect } from 'react'
import Switch from '@material-ui/core/Switch';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import './Settings.css';
import { useStateValue } from './StateProvider';
import db from './firebase';
import { useHistory } from 'react-router-dom';
import { actionTypes } from './Reducer';

function Settings() {
    const [{ classes, font, url, pallet }, dispatch] = useStateValue();

    // Default the current selection to the first highlight pallet
    const [currentSelection, setCurrentSelection] = useState(1);
    const [currentFont, setCurrentFont] = useState("");
    const [currentUrl, setCurrentUrl] = useState("");
    const [saved, setSaved] = useState(true);
    const [isCustom, setIsCustom] = useState(false);
    const [{ user }] = useStateValue();

    const history = useHistory();

    // Update the color pallet
    const changeColor = (palletNum) => {
        setCurrentSelection(palletNum);
        setSaved(false);
    }

    const switchCustom = () => {
        setIsCustom(!isCustom);
        setSaved(isCustom);
        setCurrentUrl("");
    }

    const save = async (e) => {
        e.preventDefault();

        setSaved(true);
        await user?.uid;

        // Create the data structure
        var docData = {
            pallet: currentSelection,
            font: currentFont,
            url: currentUrl,
        };
        
        // Push preferences to data layer
        dispatch({
            type: actionTypes.UPDATE_FONT,
            font: docData.font,
        })

        dispatch({
            type: actionTypes.UPDATE_PALLET,
            pallet: docData.pallet,
        })

        dispatch({
            type: actionTypes.UPDATE_URL,
            url: docData.url,
        })

        // Add the data to firestore
        db.collection("users")
            .doc(user?.uid)
            .collection("preferences")
            .doc("userPreferences")
            .set(docData)
            .then(
                history.push("/home")
            );
    }

    useEffect(() => {
        // If the user has not set up the home screen push home
        if (classes.length == 0) {
            history.push('/home');
        }

        // Otherwise set the font pallet and url for the page
        if (font[0] != undefined) {
            setCurrentFont(font[0]);
        }

        if (pallet[0] != undefined) {
            setCurrentSelection(pallet[0]);
        }

        if (url[0] != undefined && url[0] != [""]) {
            setCurrentUrl(url[0]);
            setIsCustom(true);
        }
    }, [])

    return (
        <div className="settings">
            <div className="settings__container">
                <small>Settings</small>
                <hr />
                <br />
                <div className="settings__field">
                    <small>Highlight Pallet:</small>
                    <div className="settings__highlightPallets">
                        <div className="settings__highlightChoice" onClick={(e) => { e.preventDefault(); changeColor(1); }} style={currentSelection == 1 ? {borderColor: "var(--accent-color)"} : {}}>
                            <div className="highlightColor" style={{ backgroundColor: "rgb(248,237,167)" }}/>
                            <div className="highlightColor" style={{ backgroundColor: "rgb(250,203,216)" }}/>
                            <div className="highlightColor" style={{ backgroundColor: "rgb(187,225,247)" }}/>
                        </div>
                        <div className="settings__highlightChoice" onClick={(e) => { e.preventDefault(); changeColor(2); }} style={currentSelection == 2 ? {borderColor: "var(--accent-color)"} : {}}>
                            <div className="highlightColor" style={{ backgroundColor: "rgb(252,205,166)" }}/>
                            <div className="highlightColor" style={{ backgroundColor: "rgb(230,210,228)" }}/>
                            <div className="highlightColor" style={{ backgroundColor: "rgb(218,238,245)" }}/>
                        </div>
                        <div className="settings__highlightChoice" onClick={(e) => { e.preventDefault(); changeColor(3); }} style={currentSelection == 3 ? {borderColor: "var(--accent-color)"} : {}}>
                            <div className="highlightColor" style={{ backgroundColor: "rgb(205,230,192)" }}/>
                            <div className="highlightColor" style={{ backgroundColor: "rgb(251,210,194)" }}/>
                            <div className="highlightColor" style={{ backgroundColor: "rgb(249,200,202)" }}/>
                        </div>
                    </div>
                </div>

                <div className="settings__field">
                    <small>Font:</small>
                    <FormControl variant="filled" className="settings__dropdown">
                        <InputLabel id="demo-simple-select-filled-label">Select Font</InputLabel>
                        <Select
                            value={currentFont}
                            onChange={(event) => { setCurrentFont(event.target.value); setSaved(false); }}
                            label="select font"
                        >
                            <MenuItem value='none'>None</MenuItem>
                            <MenuItem value='Balsamiq Sans' style={{ fontFamily: "'Balsamiq Sans', cursive" }}>Balsamiq Sans</MenuItem>
                            <MenuItem value='Caveat' style={{ fontFamily: "'Caveat', cursive" }}>Caveat</MenuItem>
                            <MenuItem value='Indie Flower' style={{ fontFamily: "'Indie Flower', cursive" }}>Indie Flower</MenuItem>
                            <MenuItem value='Itim' style={{ fontFamily: "'Itim', cursive" }}>Itim</MenuItem>
                            <MenuItem value='Pacifico' style={{ fontFamily: "'Pacifico', cursive" }}>Pacifico</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                <div className="settings__field">
                    <small>Custom Background:</small>
                    <Switch 
                        checked={isCustom}
                        onChange={switchCustom}
                        color="primary"
                        name="checkedB"
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                        className="settings__switch"
                    />
                    {isCustom ? (
                        <div className="settings__urlInput">
                            <input type="text" className="settings__inputField" placeholder="Enter an Image URL" disabled={!isCustom} value={currentUrl} onChange={(e) => { setCurrentUrl(e.target.value); setSaved(false); }}/>
                        </div>
                    ) : null}
                </div>

                <button className="settings__saveBtn" disabled={saved} onClick={save}>Save Changes</button>
            </div>
        </div>
    )
}

export default Settings
