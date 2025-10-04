import React from 'react';
import { ChevronLeftIcon } from '../constants/icons';
import ContactListItem from '../components/ContactListItem';
import { useChatStore } from '../store/chatStore';
import { useUIStore } from '../store/uiStore';

const ContactsScreen: React.FC = () => {
  const contacts = useChatStore((state) => state.contacts);
  const startNewChat = useChatStore((state) => state.startNewChat);
  const navigateTo = useUIStore((state) => state.navigateTo);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-black text-black dark:text-white">
      <header className="bg-gray-50 dark:bg-gray-900 p-3 flex items-center border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <button onClick={() => navigateTo('home')} className="text-blue-500 p-2" aria-label="Back">
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <div className="ml-2">
            <h1 className="text-xl font-bold">Contacts</h1>
            <p className="text-sm text-gray-500">{contacts.length} contacts</p>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto">
        {contacts.map((contact, index) => (
          <React.Fragment key={contact.id}>
            <ContactListItem
              contact={contact}
              onClick={() => startNewChat(contact)}
            />
            {index < contacts.length - 1 && <hr className="border-gray-200 dark:border-gray-700 mx-4" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ContactsScreen;