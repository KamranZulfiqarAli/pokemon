import { useEffect, useState } from "react";
import popupStyles from "./custom-popup.module.css";
import PropTypes from "prop-types";
const CustomPopup = (props) => {
	const [show, setShow] = useState(false);
	const [myList, setMyList] = useState([]);
	const [disableAdd, setDisableAdd] = useState(false);
	
	const [id, setId] = useState(null);
	const [title, setTitle] = useState("");
	const [xp, setXp] = useState(null);
	const [height, setHeight] = useState(null);
	const [weight, setWeight] = useState(null);
	const [types, setTypes] = useState("");
	const [abilities, setAbilities] = useState([]);
	const [desc1, setDesc1] = useState("");
	const [desc2, setDesc2] = useState("");
	const [desc3, setDesc3] = useState("");
	const [desc4, setDesc4] = useState("");

	const closeHandler = (e) => {
		props.parentCallback(myList);
		setShow(false);
		props.onClose(false);
	};

	useEffect(() => {
		let mounted = true;
		setShow(props.show);
		fetch(props.url)
			.then(data => data.json())
			.then(items => {
				if(mounted) {
					setDesc1("");
					setDesc2("");
					setDesc3("");
					setDesc4("");
					setId(items.id);
					if (myList.some(e => e.name === items.name && e.id === items.id)){
						setDisableAdd(true);
					}else{
						setDisableAdd(false);
					}
					setTitle(items.name);
					setXp(items.base_experience);
					setHeight(items.height);
					setWeight(items.weight);
					let types = "";
					for (let i=0; i<items.types.length; i++){
						if (i == 0){
							types = types + items.types[i].type.name;
						}else{
							types = types + ', ' + items.types[i].type.name;
						}
					}
					setTypes(types);
					let abilities = ['', '', '', ''];
					for (let i=0; i<items.abilities.length; i++){
						abilities[items.abilities[i].slot - 1] = items.abilities[i].ability.name + "\n"; 
						if (items.abilities[i].is_hidden){
							abilities[items.abilities[i].slot - 1] = abilities[items.abilities[i].slot - 1] + "(Hidden)"
						}
						
						getAbilityDescription(items.abilities[i].ability.url).then(
							response => {
								if (items.abilities[i].slot === 1){
									setDesc1(response);
								}else if (items.abilities[i].slot === 2){
									setDesc2(response);
								}else if (items.abilities[i].slot === 3){
									setDesc3(response);
								}else if (items.abilities[i].slot === 4){
									setDesc4(response);
								}
							}
						);
					}
					setAbilities(abilities);
				}
				return () => mounted = false;
			});
	}, [props.show]);
	
	const getAbilityDescription = (url) => {
		return fetch(url)
			.then(data => data.json())
			.then(items => {
				for (let i=0; i<items.effect_entries.length; i++){
					if (items.effect_entries[i].language.name == "en"){
						return items.effect_entries[i].effect;
					}
				}
			});
	};
  
	const addToList = (e) => {
		e.preventDefault();
		myList.push({"id": id, "name": title});
		setMyList([...myList]);
		setDisableAdd(true);
		return;
	};
	
	const removeFromList = (e) => {
		e.preventDefault();
		const index = myList.findIndex(x => x.id === id && x.name === title);
		if (index > -1) {
			myList.splice(index, 1);
		}
		setMyList([...myList]);
		setDisableAdd(false);
		return;
	};

	return (
	<div
		style={{
			visibility: show ? "visible" : "hidden",
			opacity: show ? "1" : "0"
		}}
		className={popupStyles.overlay}
	>
		<div className={popupStyles.popup}>
			<h1>{title.toUpperCase()}</h1>
			<span className={popupStyles.close} onClick={closeHandler}>
				&times;
			</span>
			<div className={popupStyles.content}>
				<h3>Base Stats:</h3>
				<ul>
					<li>Base Experience: {xp}</li>
					<li>Height: {height}</li>
					<li>Weight: {weight}</li>
				</ul>
				<h3>Type(s):</h3>
				<ul>
					<li>{types}</li>
				</ul>
				<h3>Abilities:</h3>
				<table>
					<col width="150px" />
					<col width="150px" />
					<col width="150px" />
					<col width="150px" />
					<tr>
						<td title={desc1}>{abilities[0]}</td>
						<td title={desc2}>{abilities[1]}</td>
						<td title={desc3}>{abilities[2]}</td>
						<td title={desc4}>{abilities[3]}</td>
					</tr>
				</table>
			</div>
			<button disabled={disableAdd} onClick={addToList}>Add</button>
			<button disabled={!disableAdd} onClick={removeFromList}>Remove</button>
		</div>
	</div>
	);
};

CustomPopup.propTypes = {
	url: PropTypes.string.isRequired,
	show: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	parentCallback: PropTypes.func.isRequired
};
export default CustomPopup;

