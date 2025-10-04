import React from 'react';
import { ChevronLeftIcon, GroupIcon } from '../constants/icons';
import ContactListItem from '../components/ContactListItem';
import { useChatStore } from '../store/chatStore';
import { useUIStore } from '../store/uiStore';

const NewChatScreen: React.FC = () => {
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
            <h1 className="text-xl font-bold">New Chat</h1>
            <p className="text-sm text-gray-500">{contacts.length} contacts</p>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto">
        <div
            className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200"
            onClick={() => navigateTo('new-group')}
        >
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center mr-4">
                <GroupIcon className="w-6 h-6 text-white"/>
            </div>
            <div className="flex-1">
                <h2 className="text-lg font-semibold text-blue-500 dark:text-blue-400">New Group</h2>
            </div>
        </div>
        <hr className="border-gray-200 dark:border-gray-700" />
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

export default NewChatScreen;