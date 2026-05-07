import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <div className="landing-content">
        <div className="logo">⍟</div>
        <h1 className="product-name">Kringe</h1>
        <p className="tagline">
          Raw anonymous thoughts from strangers.<br />
          Post anything. Say everything.
        </p>
        <button className="jump-in-btn" onClick={() => navigate('/feed')}>
          JUMP IN
        </button>
      </div>
      <div className="landing-footer">
        <span>no signup • no tracking • pure chaos</span>
      </div>
    </div>
  );
};

export default Landing;