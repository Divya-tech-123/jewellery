import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Loading from '../../components/Loading';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users');
        if (res.data.success) {
          setUsers(res.data.users);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <div className="pb-6 mb-8 border-b border-lumiere-border">
        <span className="font-eyebrow block mb-1">CONNOISSEUR DIRECTORY</span>
        <h1 className="font-serif text-3xl sm:text-4xl text-lumiere-charcoal font-normal">
          Registered Patrons ({users.length})
        </h1>
      </div>

      {loading ? (
        <Loading text="Loading Patron Directory..." />
      ) : (
        <div className="bg-white border border-lumiere-border overflow-x-auto shadow-sm">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-lumiere-border bg-[#FAF7F2] text-lumiere-charcoal uppercase tracking-wider text-[10px]">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Contact Phone</th>
                <th className="p-4">Member Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-lumiere-border/60">
              {users.map((u) => (
                <tr key={u._id || u.email} className="hover:bg-[#FAF7F2]/50">
                  <td className="p-4 font-medium text-sm text-lumiere-charcoal">{u.name}</td>
                  <td className="p-4 font-mono text-[11px] text-lumiere-muted">{u.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      u.role === 'admin' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-stone-100 text-stone-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-lumiere-muted">{u.phone || '—'}</td>
                  <td className="p-4 text-lumiere-light text-[11px]">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : 'Recent'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
