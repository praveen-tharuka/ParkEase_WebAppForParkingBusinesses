import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import api from '../../services/api';

const MyProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || '',
    profilePicture: user?.profilePicture || null,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zipCode: user.zipCode || '',
        profilePicture: user.profilePicture || null,
      });
    }
  }, [user]);

  // Generate avatar initials
  const getAvatarInitials = () => {
    if (formData.name) {
      const parts = formData.name.split(' ');
      return parts.map(part => part[0]).join('').toUpperCase().substring(0, 2);
    }
    return 'U';
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (formData.phone && !/^[0-9\-\s\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
        setFormData(prev => ({
          ...prev,
          profilePicture: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const updatePayload = {
        fullName: formData.name,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        profilePictureUrl: formData.profilePicture,
      };

      const response = await api.usersAPI.updateUserProfile(user.id, updatePayload);
      
      if (response.success) {
        updateUser(response.data);
        setSuccess(true);
        setIsEditing(false);
        // Hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.error || 'Failed to update profile. Please try again.');
      }
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error('Profile update error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      city: user?.city || '',
      state: user?.state || '',
      zipCode: user?.zipCode || '',
      profilePicture: user?.profilePicture || null,
    });
    setIsEditing(false);
    setErrors({});
    setProfilePicturePreview(null);
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your personal information and account details</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
            <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="font-semibold text-green-800">Profile Updated</h3>
              <p className="text-sm text-green-700 mt-1">Your profile has been successfully saved.</p>
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

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {/* Profile Picture Section */}
          <div className="flex items-center gap-6 pb-6 border-b">
            <div className="flex-shrink-0">
              {profilePicturePreview ? (
                <img 
                  src={profilePicturePreview} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full object-cover bg-gray-100"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-brand text-white flex items-center justify-center text-2xl font-bold">
                  {getAvatarInitials()}
                </div>
              )}
            </div>
            <div className="flex-grow">
              <h2 className="text-2xl font-bold text-gray-800">{formData.name || 'Your Name'}</h2>
              <p className="text-gray-600">{formData.email || 'your.email@example.com'}</p>
              {isEditing && (
                <div className="mt-3">
                  <label className="flex items-center px-4 py-2 bg-brand text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors w-fit">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Change Photo
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSaveProfile}>
            <div className="pt-6">
              {/* Personal Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    ) : (
                      <p className="text-gray-800 py-2">{formData.name}</p>
                    )}
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full px-4 py-2 border border-gray-200 bg-gray-100 rounded-lg text-gray-500 cursor-not-allowed focus:outline-none"
                      />
                    ) : (
                      <p className="text-gray-800 py-2">{formData.email}</p>
                    )}
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    ) : (
                      <p className="text-gray-800 py-2">{formData.phone || 'Not provided'}</p>
                    )}
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Address</h3>
                <div className="grid grid-cols-1 gap-6">
                  {/* Street Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                    ) : (
                      <p className="text-gray-800 py-2">{formData.address || 'Not provided'}</p>
                    )}
                  </div>

                  {/* City, State, Zip */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                        />
                      ) : (
                        <p className="text-gray-800 py-2">{formData.city || 'Not provided'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                        />
                      ) : (
                        <p className="text-gray-800 py-2">{formData.state || 'Not provided'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Zip Code
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                        />
                      ) : (
                        <p className="text-gray-800 py-2">{formData.zipCode || 'Not provided'}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t">
                {isEditing ? (
                  <>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center gap-2 px-6 py-2 bg-brand text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-6 py-2 bg-brand text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyProfilePage;
