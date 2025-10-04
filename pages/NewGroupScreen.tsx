
import React, { useState } from 'react';
// Fix: Corrected import path for type definitions.
import type { UserProfile } from '../types/index';
import { ChevronLeftIcon } from '../constants/icons';
import { useChatStore } from '../store/chatStore';
import { useUIStore } from '../store/uiStore';

const NewGroupScreen: React.FC = () => {
  const [selectedContacts, setSelectedContacts] = useState<UserProfile[]>([]);
  const [groupName, setGroupName] = useState('');
  
  const contacts = useChatStore((state) => state.contacts);
  const createGroup = useChatStore((state) => state.createGroup);
  const navigateTo = useUIStore((state) => state.navigateTo);

  const toggleContactSelection = (contact: UserProfile) => {
    setSelectedContacts(prev => 
      prev.find(c => c.id === contact.id)
        ? prev.filter(c => c.id !== contact.id)
        : [...prev, contact]
    );
  };

  const handleCreate = () => {
    if (groupName.trim() && selectedContacts.length > 0) {
      createGroup(groupName, selectedContacts);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-black text-black dark:text-white">
      <header className="bg-gray-50 dark:bg-gray-900 p-3 flex items-center border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <button onClick={() => navigateTo('new-chat')} className="text-blue-500 p-2" aria-label="Back">
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <div className="ml-2">
            <h1 className="text-xl font-bold">New Group</h1>
        </div>
      </header>
      
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex flex-wrap gap-2 mt-3">
            {selectedContacts.map(contact => (
                <div key={contact.id} className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-sm font-semibold px-2.5 py-1 rounded-full flex items-center">
                    {contact.name.split(' ')[0]}
                    <button onClick={() => toggleContactSelection(contact)} className="ml-2 text-blue-500 hover:text-blue-700">&times;</button>
                </div>
            ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {contacts.map((contact) => {
            const isSelected = selectedContacts.some(c => c.id === contact.id);
            return (
                <div
                    key={contact.id}
                    className={`flex items-center p-3 cursor-pointer transition-colors duration-200 ${isSelected ? 'bg-blue-100 dark:bg-blue-900/50' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    onClick={() => toggleContactSelection(contact)}
                >
                    <div className="relative">
                        <img
                            src={contact.avatar}
                            alt={contact.name}
                            className="w-12 h-12 rounded-full object-cover mr-4"
                        />
                        {isSelected && (
                            <div className="absolute bottom-0 right-3 bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center text-white border-2 border-white dark:border-black">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" /></svg>
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{contact.name}</h2>
                    </div>
                </div>
            )
        })}
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button
            onClick={handleCreate}
            disabled={!groupName.trim() || selectedContacts.length === 0}
            className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-colors"
        >
            Create Group
        </button>
      </div>
    </div>
  );
};

export default NewGroupScreen;
