import './App.css';
import {useLocation, useNavigate} from 'react-router-dom';

function Success() {

  const location = useLocation();
  const navigate = useNavigate();

  const onClickFindBtn = () => {
    navigate("/");
  };

  console.log(location?.state);

  return (
    <div className="Success">
      <div id="Success">
        <h2>Finding Falcone!</h2>
        <p>Success! Congratulations on Finding Falcone. King Shan is mighty pleased.</p>
        <p>{'Time taken : ' + parseInt(location?.state?.time)}</p>
        <p>{'Planet found: ' + location?.state?.planetName}</p>
        <button onClick={onClickFindBtn}>
          Start Again
        </button>

      </div>
    </div>
  );
}

export default Success;
