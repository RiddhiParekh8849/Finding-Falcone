import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function Dashboard() {
  const [isEnabledFind, setIsEnabledFind] = useState(true);
  const navigate = useNavigate();

  const [planetName, setPlanetName] = useState([]);
  const [remainingPlanet, setRemainingPlanet] = useState([]);

  const [vehicleList, setVehicleList] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState([]);

  const [totalTakenTime, setTotalTakenTime] = useState(0);
  const [finalPlanetList, setFinalPlanetList] = useState([]);
  const [finalVehicleList, setFinalVehicleList] = useState([]);

  // These APIs are for total Planet and Vehicle list
  useEffect(() => {
    fetch("https://findfalcone.herokuapp.com/vehicles")
      .then((res) => res.json())
      .then(
        (result) => {
          setVehicleList(result);
        },
        (error) => {
          console.log('Getting Error: ', error);
        }
      );

    fetch("https://findfalcone.herokuapp.com/planets")
      .then((res) => res.json())
      .then(
        (result) => {
          setPlanetName(result);
        },
        (error) => {
          console.log('Getting Error: ', error);
        }
      );
  }, []);

  useEffect(() => {
    let tempTotalDistance = 0;
    let tempTotalSpeed = 0;
    let tempTotalTakenTime = 0;
    let tempSelectedPlanetArr = [];
    let tempSelectedVehicleArr = [];

    remainingPlanet.map((data, index) => {
      return (
        tempSelectedPlanetArr.push(data.name),
        tempTotalDistance += data.distance
      );
    })

    selectedVehicle.map((data, index) => {
      return (
        tempSelectedVehicleArr.push(data.name),
        tempTotalSpeed += data.speed);
    })

    if (tempTotalSpeed !== 0) {
      tempTotalTakenTime = tempTotalDistance / tempTotalSpeed;
    }

    if (remainingPlanet.length === 4 && selectedVehicle.length === 4) {
      setIsEnabledFind(false);
    }

    setFinalPlanetList(tempSelectedPlanetArr);
    setFinalVehicleList(tempSelectedVehicleArr);
    setTotalTakenTime(tempTotalTakenTime);
  }, [selectedVehicle, remainingPlanet]);

  const onChangeValue = (event, index) => {
    setSelectedVehicle((preState) => {
      const tempObj = vehicleList.find((x) => x.name === event.target.value);
      if (index === 0 && vehicleList.length === 0) {
        preState.push(tempObj);
      } else if (index === 0) {
        preState[0] = tempObj;
      }

      if (index === 1 && vehicleList.length === 1) {
        preState.push(tempObj);
      } else if (index === 1) {
        preState[1] = tempObj;
      }

      if (index === 2 && vehicleList.length === 2) {
        preState.push(tempObj);
      } else if (index === 2) {
        preState[2] = tempObj;
      }

      if (index === 3 && vehicleList.length === 3) {
        preState.push(tempObj);
      } else if (index === 3) {
        preState[3] = tempObj;
      }
      return [...preState];
    });

  };

  // When find falcone button calls
  const onClickFindBtn = async () => {
    fetch('https://findfalcone.herokuapp.com/token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
    }).then((res) => res.json())
      .then(
        (result) => {
          let apiData = {
            token: result.token,
            planet_names: finalPlanetList,
            vehicle_names: finalVehicleList,
          };

          fetch('https://findfalcone.herokuapp.com/find', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(apiData)
          }).then((res) => res.json()).then(
            (result) => {
              navigate("/success", { state: { time: totalTakenTime, planetName: result.status !== false ? result.planet_name : 'Planet not found' } });
            },
            (error) => {
              console.log('Getting Error: ', error);
            }
          );

        },
        (error) => {
          console.log('Getting Error: ', error);
        }
      );
  };

  // When planets are changed from dropdown
  const onChangePlanet = (event, index) => {
    setRemainingPlanet((preState) => {
      const tempObj = planetName.find((x) => x.name === event.target.value);
      if (index === 0 && remainingPlanet.length === 0) {
        preState.push(tempObj);
      } else if (index === 0) {
        preState[0] = tempObj;
      }

      if (index === 1 && remainingPlanet.length === 1) {
        preState.push(tempObj);
      } else if (index === 1) {
        preState[1] = tempObj;
      }

      if (index === 2 && remainingPlanet.length === 2) {
        preState.push(tempObj);
      } else if (index === 2) {
        preState[2] = tempObj;
      }

      if (index === 3 && remainingPlanet.length === 3) {
        preState.push(tempObj);
      } else if (index === 3) {
        preState[3] = tempObj;
      }
      return [...preState];
    });
  };

  const onClickReset = () => {
    setRemainingPlanet([]);
    setSelectedVehicle([]);

  };

  return (
    <div className="App">
      <div id="App">
        <div className="reset-container">
          <ul>
            <li onClick={onClickReset}>Reset </li>
            <li>|</li>
            <li onClick={() => navigate("/")}>Home</li>
          </ul>
        </div>
        <h2>Finding Falcone!</h2>
        <p>Select planets you want to search in:</p>
        <div className="select-container">
          <div className="destination-container">
            <p>Destination 1</p>
            <select id="first" onChange={(event) => onChangePlanet(event, 0)}>
              {planetName.map((option) => (
                <option value={option.name}>{option.name}</option>
              ))}
            </select>
            <div className="vehicle-container" onChange={(event) => onChangeValue(event, 0)}>
              {planetName.map((option) => (
                remainingPlanet.indexOf(option) === 0 ?
                  vehicleList.map((data, index) => (
                    <div key={index}>
                      <input disabled={selectedVehicle.includes(data)} type="radio" value={data.name} name="vehicle" />{" "}
                      <span style={{ color: selectedVehicle.includes(data) ? 'grey' : '#000' }}>{data.name + " (" + data.total_no + ")"}</span>
                    </div>
                  ))
                  : null
              ))}
            </div>
          </div>
          <div className="destination-container">
            <p>Destination 2</p>
            <select
              id="second"
              onChange={(event) => onChangePlanet(event, 1)}
              value={remainingPlanet[1]?.name}
              disabled={remainingPlanet.length > 0 ? false : true}
            >
              {planetName.map((option) => {
                if (remainingPlanet.indexOf(option) !== 0) {
                  return <option value={option.name}>{option.name}</option>;
                }
              })}
            </select>
            <div className="vehicle-container" onChange={(event) => onChangeValue(event, 1)}>
              {planetName.map((option) => (
                remainingPlanet.indexOf(option) === 1 ?
                  vehicleList.map((data, index) => (
                    <div key={index}>
                      <input disabled={selectedVehicle.includes(data)} type="radio" value={data.name} name="vehicle" />{" "}
                      <span style={{ color: selectedVehicle.includes(data) ? 'grey' : '#000' }}>{data.name + " (" + data.total_no + ")"}</span>
                    </div>
                  ))
                  : null
              ))}
            </div>
          </div>
          <div className="destination-container">
            <p>Destination 3</p>
            <select
              id="third"
              value={remainingPlanet[2]?.name}
              onChange={(event) => onChangePlanet(event, 2)}
              disabled={remainingPlanet.length > 1 ? false : true}
            >
              {planetName.map((option) => {
                if (
                  remainingPlanet.indexOf(option) !== 0 &&
                  remainingPlanet.indexOf(option) !== 1
                ) {
                  return <option value={option.name}>{option.name}</option>;
                }
              })}
            </select>
            <div className="vehicle-container" onChange={(event) => onChangeValue(event, 2)}>
              {planetName.map((option) => (
                remainingPlanet.indexOf(option) === 2 ?
                  vehicleList.map((data, index) => (
                    <div key={index}>
                      <input disabled={selectedVehicle.includes(data)} type="radio" value={data.name} name="vehicle" />{" "}
                      <span style={{ color: selectedVehicle.includes(data) ? 'grey' : '#000' }}>{data.name + " (" + data.total_no + ")"}</span>
                    </div>
                  ))
                  : null
              ))}
            </div>
          </div>
          <div className="destination-container">
            <p>Destination 4</p>
            <select
              id="forth"
              value={remainingPlanet[3]?.name}
              onChange={(event) => onChangePlanet(event, 3)}
              disabled={remainingPlanet.length > 2 ? false : true}
            >
              {planetName.map((option) => {
                if (
                  remainingPlanet.indexOf(option) !== 0 &&
                  remainingPlanet.indexOf(option) !== 1 &&
                  remainingPlanet.indexOf(option) !== 2
                ) {
                  return <option value={option.name}>{option.name}</option>;
                }
              })}
            </select>
            <div className="vehicle-container" onChange={(event) => onChangeValue(event, 3)}>
              {planetName.map((option) => (
                remainingPlanet.indexOf(option) === 3 ?
                  vehicleList.map((data, index) => (
                    <div key={index}>
                      <input disabled={selectedVehicle.includes(data)} type="radio" value={data.name} name="vehicle" />{" "}
                      <span style={{ color: selectedVehicle.includes(data) ? 'grey' : '#000' }}>{data.name + " (" + data.total_no + ")"}</span>
                    </div>
                  ))
                  : null
              ))}
            </div>
          </div>
          <div className="destination-container">
            <p>{'Time Taken: ' + parseInt(totalTakenTime)}</p>
          </div>
        </div>

        <button className="btn-find-falcone" disabled={isEnabledFind} onClick={onClickFindBtn}>
          Find Falcone!
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
