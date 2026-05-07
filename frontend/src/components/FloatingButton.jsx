import './FloatingButton.css';

const FloatingButton = ({ onClick }) => {
  return (
    <button className="fab" onClick={onClick}>
      <span className="fab-icon">+</span>
    </button>
  );
};

export default FloatingButton;