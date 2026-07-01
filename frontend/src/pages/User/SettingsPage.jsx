import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import api from '../../services/api';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('password');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Password Change State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: false,
    reservationReminders: true,
    paymentAlerts: true,
  });

  // Privacy Settings State
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'private',
    showReservationHistory: false,
    allowDataCollection: true,
    allowThirdPartySharing: false,
  });

  // Session Management State
  const [activeSessions, setActiveSessions] = useState([]);

  // Load preferences and sessions on mount
  useEffect(() => {
    const loadSettingsAndSessions = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      try {
        const [profileRes, sessionsRes] = await Promise.all([
          api.usersAPI.getUserProfile(user.id),
          api.usersAPI.getUserSessions(user.id)
        ]);

        if (profileRes.success) {
          const prefs = profileRes.data.preferences;
          if (prefs) {
            setNotificationSettings({
              emailNotifications: prefs.emailNotifications ?? true,
              smsNotifications: prefs.smsNotifications ?? false,
              pushNotifications: prefs.pushNotifications ?? true,
              marketingEmails: prefs.marketingEmails ?? false,
              reservationReminders: prefs.reservationReminders ?? true,
              paymentAlerts: prefs.paymentAlerts ?? true,
            });

            setPrivacySettings({
              profileVisibility: prefs.profileVisibility ?? 'private',
              showReservationHistory: prefs.showReservationHistory ?? false,
              allowDataCollection: prefs.allowDataCollection ?? true,
              allowThirdPartySharing: prefs.allowThirdPartySharing ?? false,
            });
          }
        }

        if (sessionsRes.success) {
          setActiveSessions(sessionsRes.data);
        }
      } catch (err) {
        console.error('Failed to load user settings or sessions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettingsAndSessions();
  }, [user?.id]);

  // Password Change Validation
  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(passwordForm.newPassword)) {
      errors.newPassword = 'Password must contain an uppercase letter';
    } else if (!/[0-9]/.test(passwordForm.newPassword)) {
      errors.newPassword = 'Password must contain a number';
    }

    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      errors.newPassword = 'New password must be different from current password';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validatePasswordForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.usersAPI.changePassword(
        user.id,
        passwordForm.currentPassword,
        passwordForm.newPassword
      );

      if (response.success) {
        setSuccess(true);
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.error || 'Failed to change password. Please check your current password.');
      }
    } catch (err) {
      setError('Failed to change password. Please check your current password.');
      console.error('Password change error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationChange = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handlePrivacyChange = (setting, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSaveSettings = async (type) => {
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    try {
      const payload = type === 'notifications' ? notificationSettings : privacySettings;
      const response = await api.usersAPI.updateUserProfile(user.id, payload);

      if (response.success) {
        updateUser(response.data);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.error || 'Failed to save settings. Please try again.');
      }
    } catch (err) {
      setError('Failed to save settings. Please try again.');
      console.error('Settings save error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoutSession = async (sessionId) => {
    if (window.confirm('Are you sure you want to log out of this session?')) {
      setIsLoading(true);
      try {
        const response = await api.usersAPI.deleteSession(user.id, sessionId);
        if (response.success) {
          setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
        } else {
          setError(response.error || 'Failed to revoke session.');
        }
      } catch (err) {
        setError('Failed to revoke session.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleLogoutAllSessions = async () => {
    if (window.confirm('Are you sure? You will be logged out from all other devices.')) {
      setIsLoading(true);
      try {
        const response = await api.usersAPI.deleteAllSessions(user.id);
        if (response.success) {
          setActiveSessions(prev => prev.filter(session => session.isCurrent));
        } else {
          setError(response.error || 'Failed to logout from other sessions.');
        }
      } catch (err) {
        setError('Failed to logout from other sessions.');
        console.error('Logout all error:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you absolutely sure? This action cannot be undone. All your data will be permanently deleted.')) {
      if (window.confirm('This is your final warning. Type "DELETE" in the next prompt to confirm.')) {
        const confirmation = window.prompt('Type DELETE to confirm account deletion:');
        if (confirmation === 'DELETE') {
          setIsLoading(true);
          try {
            const response = await api.usersAPI.deleteAccount(user.id);
            if (response.success) {
              logout();
              navigate('/');
            } else {
              setError(response.error || 'Failed to delete account. Please try again.');
            }
          } catch (err) {
            setError('Failed to delete account. Please try again.');
            console.error('Account deletion error:', err);
          } finally {
            setIsLoading(false);
          }
        }
      }
    }
  };


  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account security, notifications, and preferences</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
            <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="font-semibold text-green-800">Success</h3>
              <p className="text-sm text-green-700 mt-1">Your settings have been saved successfully.</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="font-semibold text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Settings Tabs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b flex-wrap gap-0">
            {[
              { id: 'password', label: 'Password & Security' },
              { id: 'notifications', label: 'Notifications' },
              { id: 'privacy', label: 'Privacy' },
              { id: 'sessions', label: 'Sessions' },
              { id: 'account', label: 'Account' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-4 text-center font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-brand text-brand'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Password & Security Tab */}
            {activeTab === 'password' && (
              <div className="max-w-2xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Change Password</h3>
                <form onSubmit={handleSavePassword}>
                  <div className="space-y-6">
                    {/* Current Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand ${
                          passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your current password"
                      />
                      {passwordErrors.currentPassword && (
                        <p className="text-red-500 text-sm mt-1">{passwordErrors.currentPassword}</p>
                      )}
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand ${
                          passwordErrors.newPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter new password"
                      />
                      {passwordErrors.newPassword && (
                        <p className="text-red-500 text-sm mt-1">{passwordErrors.newPassword}</p>
                      )}
                      <p className="text-gray-500 text-xs mt-2">
                        Must be at least 8 characters with uppercase and number
                      </p>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand ${
                          passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Confirm new password"
                      />
                      {passwordErrors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">{passwordErrors.confirmPassword}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full px-6 py-2 bg-brand text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      {isLoading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="max-w-2xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Notification Preferences</h3>
                <div className="space-y-6">
                  {/* Email Notifications */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800">Email Notifications</h4>
                      <p className="text-sm text-gray-600 mt-1">Receive updates via email</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange('emailNotifications')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notificationSettings.emailNotifications ? 'bg-brand' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notificationSettings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* SMS Notifications */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800">SMS Notifications</h4>
                      <p className="text-sm text-gray-600 mt-1">Receive text messages</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange('smsNotifications')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notificationSettings.smsNotifications ? 'bg-brand' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notificationSettings.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Push Notifications */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800">Push Notifications</h4>
                      <p className="text-sm text-gray-600 mt-1">Browser push notifications</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange('pushNotifications')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notificationSettings.pushNotifications ? 'bg-brand' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notificationSettings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Reservation Reminders */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800">Reservation Reminders</h4>
                      <p className="text-sm text-gray-600 mt-1">Get reminders before your parking slot</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange('reservationReminders')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notificationSettings.reservationReminders ? 'bg-brand' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notificationSettings.reservationReminders ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Payment Alerts */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800">Payment Alerts</h4>
                      <p className="text-sm text-gray-600 mt-1">Notifications about payments and refunds</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange('paymentAlerts')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notificationSettings.paymentAlerts ? 'bg-brand' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notificationSettings.paymentAlerts ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Marketing Emails */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800">Marketing Emails</h4>
                      <p className="text-sm text-gray-600 mt-1">Promotional offers and updates</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange('marketingEmails')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notificationSettings.marketingEmails ? 'bg-brand' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notificationSettings.marketingEmails ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <button
                    onClick={() => handleSaveSettings('notifications')}
                    disabled={isLoading}
                    className="w-full px-6 py-2 bg-brand text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium mt-6"
                  >
                    {isLoading ? 'Saving...' : 'Save Notification Settings'}
                  </button>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="max-w-2xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Privacy Settings</h3>
                <div className="space-y-6">
                  {/* Profile Visibility */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-3">Profile Visibility</h4>
                    <div className="space-y-2">
                      {['private', 'friends', 'public'].map(option => (
                        <label key={option} className="flex items-center">
                          <input
                            type="radio"
                            name="profileVisibility"
                            value={option}
                            checked={privacySettings.profileVisibility === option}
                            onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                            className="h-4 w-4 text-brand"
                          />
                          <span className="ml-3 text-gray-700 capitalize">{option} Profile</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Show Reservation History */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800">Show Reservation History</h4>
                      <p className="text-sm text-gray-600 mt-1">Allow others to see your parking history</p>
                    </div>
                    <button
                      onClick={() => handlePrivacyChange('showReservationHistory', !privacySettings.showReservationHistory)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        privacySettings.showReservationHistory ? 'bg-brand' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          privacySettings.showReservationHistory ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Data Collection */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800">Allow Data Collection</h4>
                      <p className="text-sm text-gray-600 mt-1">Help us improve the app with usage analytics</p>
                    </div>
                    <button
                      onClick={() => handlePrivacyChange('allowDataCollection', !privacySettings.allowDataCollection)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        privacySettings.allowDataCollection ? 'bg-brand' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          privacySettings.allowDataCollection ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Third Party Sharing */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800">Allow Third Party Sharing</h4>
                      <p className="text-sm text-gray-600 mt-1">Share data with partner services</p>
                    </div>
                    <button
                      onClick={() => handlePrivacyChange('allowThirdPartySharing', !privacySettings.allowThirdPartySharing)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        privacySettings.allowThirdPartySharing ? 'bg-brand' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          privacySettings.allowThirdPartySharing ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <button
                    onClick={() => handleSaveSettings('privacy')}
                    disabled={isLoading}
                    className="w-full px-6 py-2 bg-brand text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium mt-6"
                  >
                    {isLoading ? 'Saving...' : 'Save Privacy Settings'}
                  </button>
                </div>
              </div>
            )}

            {/* Sessions Tab */}
            {activeTab === 'sessions' && (
              <div className="max-w-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Active Sessions</h3>
                    <p className="text-sm text-gray-600 mt-1">Devices and locations where you're signed in</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {activeSessions.map(session => (
                    <div key={session.id} className="p-4 border border-gray-200 rounded-lg flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-800">{session.device}</h4>
                          {session.isCurrent && (
                            <span className="px-2 py-1 bg-brand text-white text-xs rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          {session.browser} • {session.location}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          IP: {session.ipAddress} • Last active: {new Date(session.lastActive).toLocaleString()}
                        </p>
                      </div>
                      {!session.isCurrent && (
                        <button
                          onClick={() => handleLogoutSession(session.id)}
                          className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          Logout
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleLogoutAllSessions}
                  disabled={isLoading}
                  className="w-full mt-6 px-6 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {isLoading ? 'Logging out...' : 'Logout All Other Sessions'}
                </button>
              </div>
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
              <div className="max-w-2xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Account Management</h3>

                <div className="space-y-6">
                  {/* Danger Zone */}
                  <div className="p-6 border-2 border-red-200 bg-red-50 rounded-lg">
                    <h4 className="font-semibold text-red-900 mb-2">Danger Zone</h4>
                    <p className="text-sm text-red-800 mb-4">
                      Deleting your account is permanent and cannot be undone. All your data, reservations, and history will be deleted.
                    </p>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={isLoading}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      {isLoading ? 'Deleting...' : 'Delete Account'}
                    </button>
                  </div>

                  {/* Account Information */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-4">Account Information</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Account Created:</span>
                        <span className="font-medium">
                          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Login:</span>
                        <span className="font-medium">
                          {user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Just now'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Account Status:</span>
                        <span className="font-medium text-green-600 capitalize">
                          {user?.accountStatus?.toLowerCase() || 'Active'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
