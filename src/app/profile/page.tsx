"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

type User = {
  ID: number;
  NAME: string;
  EMAIL: string;
  MOBILE: string;
  NATIONALITY: string;
};

export default function ProfilePage() {
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        alert(t.login.title + " " + "please log in first."); // or create translation
        return;
      }

      try 
      {
        const res = await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: Number(userId) }),
        });

        const data = await res.json();

        if (data.success) 
        {
          setUser(data.user);
        } 
        else 
        {
          alert(t.profile.title + ": " + "User not found or not logged in.");
        }
      } 
      catch (error) 
      {
        console.error("Profile fetch error:", error);
      }
    };

    fetchUserData();
  }, [t]);

  if (!user) {
    return (
      <p className="text-center mt-32 text-gray-500 text-lg font-medium animate-pulse">
        {t.profile.title}... {/* Loading message could be translated as well */}
      </p>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-24 p-8 bg-white rounded-xl shadow-xl border border-gray-200">
      <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8"> {t.profile.title} </h2>
      <div className="space-y-6 text-gray-800">
        <ProfileItem label={t.profile.id} value={user.ID} />
        <ProfileItem label={t.profile.name} value={user.NAME} />
        <ProfileItem label={t.profile.email} value={user.EMAIL} />
        <ProfileItem label={t.profile.mobile} value={user.MOBILE} />
        <ProfileItem label={t.profile.nationality} value={user.NATIONALITY} />
      </div>
    </div>
  );
}

function ProfileItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-300 pb-3">
      <span className="font-semibold text-gray-600">{label}</span>
      <span className="mt-1 sm:mt-0 text-gray-900 break-words">{value}</span>
    </div>
  );
}
