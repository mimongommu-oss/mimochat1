
import React from 'react';
// Fix: Corrected import path for type definitions.
import type { UserProfile } from '../types/index';

interface ContactListItemProps {
  contact: UserProfile;
  onClick: () => void;
}

const ContactListItem: React.FC<ContactListItemProps> = ({ contact, onClick }) => {
  return (
    <div
      className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200"
      onClick={onClick}
    >
      <img
        src={contact.avatar}
        alt={contact.name}
        className="w-12 h-12 rounded-full object-cover mr-4"
      />
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{contact.name}</h2>
        {contact.status && <p className="text-sm text-gray-600 dark:text-gray-300 truncate pr-4">{contact.status}</p>}
      </div>
    </div>
  );
};

export default ContactListItem;
