import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Chip from "@mui/material/Chip";
import { makeStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import Downshift from "downshift";

const useStyles = makeStyles({
    chip: {
        // margin: theme.spacing(0.5, 0.25)
        marginRight: '100px'
    },
});

export default function ChipArray({ ...props }) {
    const classes = useStyles();
    const { selectedTags, placeholder, tags, ...other } = props;
    const [inputValue, setInputValue] = React.useState("");
    const [selectedItem, setSelectedItem] = React.useState([]);
    useEffect(() => {
        setSelectedItem(tags);
    }, [tags]);
    useEffect(() => {
        selectedTags(selectedItem);
    }, [selectedItem, selectedTags]);

    function handleKeyDown(event) {
        if (event.key === "Enter") {
            const newSelectedItem = [...selectedItem];
            const duplicatedValues = newSelectedItem.indexOf(
                event.target.value.trim()
            );

            if (duplicatedValues !== -1) {
                setInputValue("");
                return;
            }
            if (!event.target.value.replace(/\s/g, "").length) return;

            newSelectedItem.push(event.target.value.trim());
            setSelectedItem(newSelectedItem);
            setInputValue("");
        }
        if (
            selectedItem.length &&
            !inputValue.length &&
            event.key === "Backspace"
        ) {
            setSelectedItem(selectedItem.slice(0, selectedItem.length - 1));
        }
    }
    function handleChange(item) {
        let newSelectedItem = [...selectedItem];
        console.log(newSelectedItem, 'hi');
        if(newSelectedItem.length > 3){
            newSelectedItem = [...newSelectedItem, null];
        }
        else if (newSelectedItem.indexOf(item) === -1) {
            newSelectedItem = [...newSelectedItem, item];
        }
        console.log(newSelectedItem, 'bye');
        setInputValue("");
        setSelectedItem(newSelectedItem);
    }

    const handleDelete = item => () => {
        const newSelectedItem = [...selectedItem];
        newSelectedItem.splice(newSelectedItem.indexOf(item), 1);
        setSelectedItem(newSelectedItem);
    };

    function handleInputChange(event) {
        setInputValue(event.target.value);
    }
    return (
        <React.Fragment>
            <Downshift
                id="downshift-multiple"
                inputValue={inputValue}
                onChange={handleChange}
                selectedItem={selectedItem}
            >
                {({ getInputProps }) => {
                    const { onBlur, onChange, onFocus, ...inputProps } = getInputProps({
                        onKeyDown: handleKeyDown,
                        placeholder
                    });
                    return (
                        <div>
                            <TextField
                                InputProps={{
                                    startAdornment: selectedItem.map(item => (
                                        <Chip
                                            style= {{marginRight: '5px'}}
                                            key={item}
                                            tabIndex={-1}
                                            label={item}
                                            className={classes.chip}
                                            onDelete={handleDelete(item)}
                                        />
                                    )),
                                    onBlur,
                                    onChange: event => {
                                        handleInputChange(event);
                                        onChange(event);
                                    },
                                    onFocus
                                
                                }}
                                {...other}
                                {...inputProps}
                                className={classes.textField}
                            />
                        </div>
                    );
                }}
            </Downshift>
        </React.Fragment>
    );
}
ChipArray.defaultProps = {
    tags: []
};
ChipArray.propTypes = {
    selectedTags: PropTypes.func.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string)
};
