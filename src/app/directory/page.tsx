'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link'; // Added for navigation

export default function MemberDirectory() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    fetch('/api/members')
      .then((res) => res.json())
      .then((data) => {
        setMembers(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center">Loading Achievers...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Nashik Branch Directory</h1>
        {/* Link to the Mentorship Dashboard we discussed */}
        <Link href="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
          My Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {members.map((member: any) => (
          <div key={member.id} className="border p-6 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold">{member.fullName}</h2>
            <p className="text-gray-600">{member.startupName}</p>
            <div className="mt-4 flex justify-between items-center text-sm">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{member.membership}</span>
              <span className="text-gray-400">{member.industry}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}