
import React from 'react';
import HomeScreen from '../pages/HomeScreen';
import ChatScreen from '../pages/ChatScreen';
import NewChatScreen from '../pages/NewChatScreen';
import ContactsScreen from '../pages/ContactsScreen';
import ContactProfileScreen from '../pages/ContactProfileScreen';
import CallScreen from '../pages/CallScreen';
import NewGroupScreen from '../pages/NewGroupScreen';
import SettingsScreen from '../pages/SettingsScreen';
import UserProfileScreen from '../pages/UserProfileScreen';
import Modal from '../components/Modal';
import { useUIStore } from '../store/uiStore';

const MainNavigator: React.FC = () => {
    const currentPage = useUIStore((state) => state.currentPage);
    const isModalOpen = useUIStore((state) => state.isModalOpen);

    const renderPage = () => {
        switch (currentPage) {
            case 'chat':
                return <ChatScreen />;
            case 'new-chat':
                return <NewChatScreen />;
            case 'new-group':
                return <NewGroupScreen />;
            case 'contacts':
                return <ContactsScreen />;
            case 'contact-profile':
                return <ContactProfileScreen />;
            case 'call':
                return <CallScreen />;
            case 'settings':
                return <SettingsScreen />;
            case 'user-profile':
                return <UserProfileScreen />;
            case 'home':
            default:
                return <HomeScreen />;
        }
    };

    return (
        <>
            {renderPage()}
            {isModalOpen && <Modal />}
        </>
    );
};

export default MainNavigator;
