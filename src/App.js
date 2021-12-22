import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import CustomPopup from "./custom-popup/CustomPopup";

function App() {
	const [myList, setMyList] = useState([]);
	const [list, setList] = useState([]);
	const [visibility, setVisibility] = useState(false);
	const [url, setUrl] = useState("");
	
	const listInnerRef = useRef();
	
	const callbackFunction = (childData) => {
		setMyList(childData);
	};
	
	useEffect(() => {
		let mounted = true;
		fetch('https://pokeapi.co/api/v2/pokemon?limit=50')
			.then(data => data.json())
			.then(items => {
				if(mounted) {
					setList(items.results)
				}
			})
			return () => mounted = false;
	}, []);
	
	const onScroll = () => {
		if (listInnerRef.current) {
			const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
			if (scrollTop + clientHeight === scrollHeight) {
				console.log('Reached bottom');
				if (list.length % 50 == 0){
					loadMore();
				}
			}
		}
	};
	
	const loadMore = () => {
		let mounted = true;
		fetch('https://pokeapi.co/api/v2/pokemon?limit=50&offset='+list.length)
			.then(data => data.json())
			.then(items => {
				if(mounted) {
					list.push(...items.results)
					setList([...list])
				}
			})
			return () => mounted = false;
	};
	
	const itemClick = value => (e) => {
		e.preventDefault();
		setUrl(value);
		setVisibility(!visibility);
	};
	
	const popupCloseHandler = (e) => {
		setVisibility(e);
	};
	
	return (
		<div className="row">
			<div className="column">
				<h1>Pokemon List</h1>
				<ul className="list" onScroll={() => onScroll()} ref={listInnerRef}>
					{list.map(item => 
									<li key={item.name}> 
										<button
											style={{
												backgroundColor: myList.some(e => e.name === item.name) ? "green" : "white",
												color: myList.some(e => e.name === item.name) ? "white" : "black"
											}}
											onClick={itemClick(item.url)}
										>{item.name}</button>
									</li>)}
				</ul>
				<CustomPopup
					onClose={popupCloseHandler}
					show={visibility}
					url={url}
					parentCallback={callbackFunction}
				>
				</CustomPopup>
			</div>
			<div className="column">
				<h1>My Pokemons</h1>
				<ul className="list">
					{myList.map(item => 
									<li key={item.name}> 
										<button
											onClick={itemClick("https://pokeapi.co/api/v2/pokemon/" + item.id)}
										>{item.name}</button>
									</li>)}
				</ul>
				<CustomPopup
					onClose={popupCloseHandler}
					show={visibility}
					url={url}
					parentCallback={callbackFunction}
				>
				</CustomPopup>
			</div>
		</div>
	);
}

export default App;
