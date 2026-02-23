import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

function Dashboard() {
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      console.log('Fetching members from:', `${API_URL}/members`);
      const response = await axios.get(`${API_URL}/members`);
      console.log('Members fetched:', response.data);
      setMembers(response.data);
      setMessage('✅ Connected to backend successfully');
      setIsError(false);
    } catch (error) {
      console.error('Fetch error:', error);
      setMessage('❌ Cannot connect to backend. Make sure it\'s running on port 5000');
      setIsError(true);
    }
  };

  const addMember = async (e) => {
    e.preventDefault();
    
    if (!newMember.trim()) {
      setMessage('❌ Please enter a member name');
      setIsError(true);
      return;
    }

    setLoading(true);
    try {
      console.log('Adding member:', newMember.trim());
      
      const response = await axios.post(`${API_URL}/members`, { 
        name: newMember.trim() 
      });
      
      console.log('Add member response:', response.data);
      setMessage(`✅ Member "${newMember}" added successfully!`);
      setIsError(false);
      setNewMember('');
      await fetchMembers(); // Refresh the list
    } catch (error) {
      console.error('Add member error:', error.response?.data || error.message);
      
      if (error.response?.data?.error) {
        setMessage(`❌ ${error.response.data.error}`);
      } else if (error.code === 'ECONNREFUSED') {
        setMessage('❌ Cannot connect to backend. Is it running on port 5000?');
      } else {
        setMessage('❌ Error adding member. Please try again.');
      }
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <h1 style={{ color: 'white', textAlign: 'center', marginBottom: '30px' }}>
        💰 Expense Tracker Dashboard
      </h1>
      
      {message && (
        <div style={{ 
          background: isError ? '#fed7d7' : '#d4edda',
          color: isError ? '#c53030' : '#155724',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: isError ? '1px solid #feb2b2' : '1px solid #c3e6cb',
          fontWeight: '500',
          textAlign: 'center'
        }}>
          {message}
        </div>
      )}

      <div style={{ 
        background: 'white', 
        padding: '25px', 
        borderRadius: '12px', 
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '20px', color: '#333' }}>Add New Member</h2>
        <form onSubmit={addMember} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={newMember}
            onChange={(e) => {
              setNewMember(e.target.value);
              setMessage('');
            }}
            placeholder="Enter member name"
            disabled={loading}
            style={{ 
              flex: 1, 
              padding: '12px 15px', 
              border: '1px solid #ddd', 
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none',
              transition: 'border-color 0.2s',
              ':focus': {
                borderColor: '#667eea'
              }
            }}
          />
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: '12px 24px', 
              background: loading ? '#a0aec0' : '#667eea', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'background 0.2s',
              ':hover': {
                background: loading ? '#a0aec0' : '#5a67d8'
              }
            }}
          >
            {loading ? 'Adding...' : 'Add Member'}
          </button>
        </form>
      </div>

      <div style={{ 
        background: 'white', 
        padding: '25px', 
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '20px', color: '#333' }}>
          Member List ({members.length})
        </h2>
        
        {members.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {members.map((member, index) => (
              <li key={index} style={{ 
                padding: '12px 15px', 
                borderBottom: index < members.length - 1 ? '1px solid #eee' : 'none',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span style={{ fontSize: '20px' }}>👤</span>
                <span style={{ color: '#333' }}>{member}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ 
            color: '#999', 
            textAlign: 'center', 
            padding: '30px',
            background: '#f7fafc',
            borderRadius: '8px'
          }}>
            No members yet. Add your first member above!
          </p>
        )}
      </div>

      <div style={{ 
        marginTop: '20px', 
        padding: '15px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '8px',
        color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
          <span style={{ color: '#48bb78', fontSize: '18px' }}>✅</span>
          <span>Backend: Running on port 5000</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: members.length > 0 ? '#48bb78' : '#fbbf24', fontSize: '18px' }}>
            {members.length > 0 ? '✅' : '⏳'}
          </span>
          <span>Members in database: {members.length}</span>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
