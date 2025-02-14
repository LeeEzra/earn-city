import React, {useEffect, useState} from "react";
import { fetchUserDetails } from '../services/apiService';
import axios from "axios";

const AdminContent = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getUsers = async () => {
            try {
                const data = await fetchUserDetails();
                const nonAdminUsers = data.filter((user) => user.role !== 'admin');
                setUsers(nonAdminUsers);
            }
            catch (err) {
                setError('Failed to fetch user details try again.')
            }
        };

        getUsers();
    }, []);

    const deleteUser = async (user_id) => {
        const confirmDelete = window.confirm('Are you sure want to delete this user?');
        if (!confirmDelete) return;

        try {
            await axios.delete(`/auth/users/${user_id}`);
            alert('User deleted successfully');

            setUsers((prevUsers) => prevUsers.filter((user) => user.user_id !== user_id));
        }
        catch (err) {
            console.error('error deleting user ', err);
            alert('Failed to delete the user. Please try again')
        }
    };
    const deleteUserAnswers = async (user_id) => {
        const confirmDelete = window.confirm('Are you sure want to delete all answers for this user?');
        if(!confirmDelete) return;
        try {
            await axios.delete(`/auth/users/${user_id}/answers`);
            alert('User answers deleted successfully');
            setUsers((prevUsers) => prevUsers.map((user) => user.user_id === user_id? {...user, answer_count: 0} : user ));
            
        }
        catch (err) {
            console.error('Error deleting user answers:', err);
            alert('Failed to delete user answers. Please try again')
        }
    }

    

    if (error) {
        return <> { error && <div className="admin-content">
        <div className="error">{error}</div> </div> }</>
    }

    return (
        <div className="admin-content">
            {users.length === 0 ? (<h3>There are no users Found</h3>) : (
                <div className="user-cards-container">
                { users.map((user) => (
                    <div className="user-card" key={user.user_id}>
                        <div className="user-card-header">
                        <h3>{`${user.first_name} ${user.last_name}`}</h3>
                        </div>
                        <div className="user-card-body">
                            <p>Email: {user.email}</p>
                            <p>Phone: {user.phone_number}</p>
                            <p>Gender: {user.gender}</p>
                            <p>ID Number: {user.id_number}</p>
                            <p>Id: {user.user_id}</p>
                            <p>Response: {user.answer_count}</p>
                            <p>Role: {user.role}</p>
                            <div className="admin-act">
                               {user.answer_count > 0 && (<button className="form-dashboard-button" onClick={() => deleteUserAnswers(user.user_id)}>Delete Response</button>)} <button className="form-dashboard-button" onClick={() => deleteUser(user.user_id)}>Delete User</button>
                            </div>
                            </div>
                    </div>
                ))}
            </div>
            )}
        </div>
    );
};

export default AdminContent;