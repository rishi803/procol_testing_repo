import { useState } from 'react';
import { useSelector } from 'react-redux';
import { FaPlus } from 'react-icons/fa';
import GroupList from '../components/Dashboard/GroupList';
import CreateGroupModal from '../components/Dashboard/CreateGroupModal';
import AddExpenseModal from '../components/Dashboard/AddExpenseModal';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  return (
    <div className="dashboard">
      <div className="welcome-header">
        <h1>Welcome, {user.name}!</h1>
        <button 
          className="create-group-button"
          onClick={() => setShowGroupModal(true)}
        >
          Create New Group
        </button>
      </div>

      <GroupList />

      <button 
        className="add-expense-button"
        onClick={() => setShowExpenseModal(true)}
      >
        <FaPlus />
      </button>

      {showGroupModal && (
        <CreateGroupModal onClose={() => setShowGroupModal(false)} />
      )}

      {showExpenseModal && (
        <AddExpenseModal onClose={() => setShowExpenseModal(false)} />
      )}
    </div>
  );
};

export default Dashboard;