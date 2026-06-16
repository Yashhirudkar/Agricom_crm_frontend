"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/slices/authSlice";
import api from "@/lib/axios"; // Changed from @/lib/api
import ProfileHeader from "./components/ProfileHeader";
import PersonalInfoCard from "./components/PersonalInfoCard";
import AccountSettingsCard from "./components/AccountSettingsCard";
import DocumentStatusCard from "./components/DocumentStatusCard";
import Widgets from "./components/Widgets";

export default function ProfilePage() {
  const authUser = useSelector(selectUser);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [activities, setActivities] = useState([]);
  const [leaveSummary, setLeaveSummary] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [attendance, setAttendance] = useState(null);
  const [completion, setCompletion] = useState(0);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const [
        meRes,
        prefRes,
        actRes,
        leaveRes,
        docRes,
        attRes,
        compRes
      ] = await Promise.all([
        api.get('/profile/me'),
        api.get('/profile/preferences'),
        api.get('/profile/activity'),
        api.get('/profile/leave-summary'),
        api.get('/profile/document-status'),
        api.get('/profile/attendance-summary'),
        api.get('/profile/completion'),
      ]);

      setProfileData(meRes.data);
      setPreferences(prefRes.data);
      setActivities(actRes.data);
      setLeaveSummary(leaveRes.data);
      setDocuments(docRes.data);
      setAttendance(attRes.data);
      setCompletion(compRes.data.completionPercentage);
    } catch (error) {
      console.error("Failed to load profile", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007aff]"></div>
      </div>
    );
  }

  const { user, employee, type } = profileData || {};

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <ProfileHeader 
          user={user} 
          employee={employee} 
          completion={completion} 
          onUpdate={fetchProfile}
        />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content - Left Column (Forms & Settings) */}
          <div className="xl:col-span-2 space-y-8">
            {type === 'FULL' && (
              <PersonalInfoCard employee={employee} onUpdate={fetchProfile} />
            )}
            <AccountSettingsCard preferences={preferences} onUpdate={fetchProfile} />
            {type === 'FULL' && (
              <DocumentStatusCard documents={documents} />
            )}
          </div>

          {/* Sidebar - Right Column (Widgets) */}
          <div className="space-y-8">
            <Widgets 
              activities={activities} 
              attendance={attendance} 
              leaveSummary={leaveSummary} 
              type={type}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
