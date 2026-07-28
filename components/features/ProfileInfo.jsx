"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Avatar from '../common/Avatar';
import FollowButton from './FollowButton';
import EditProfileModal from './EditProfileModal';
import { FileText, Users, Heart } from 'lucide-react';

export default function ProfileInfo({ profileUser, isOwnProfile, isFollowing }) {
  const [editOpen, setEditOpen] = useState(false);
  const [followersCount, setFollowersCount] = useState(profileUser._count.followers);
  const router = useRouter();

  const handleProfileUpdate = (updatedUser) => {
    // Redirect to new username if changed, otherwise refresh
    if (updatedUser.username !== profileUser.username) {
      router.push(`/profile/${updatedUser.username}`);
    } else {
      router.refresh();
    }
  };

  const handleFollowStateChange = (nextFollowing) => {
    setFollowersCount((count) => count + (nextFollowing ? 1 : -1));
  };

  return (
    <>
      <div className="px-4 py-6 border-b border-outline">
        <div className="flex items-start justify-between mb-4">
          <Avatar src={profileUser.avatarUrl} size="xl" username={profileUser.username} />

          {isOwnProfile ? (
            <button
              onClick={() => setEditOpen(true)}
              className="border border-outline text-text-primary rounded-button px-4 py-1.5 text-sm font-medium hover:bg-surface-container transition-colors active:scale-95"
            >
              Edit Profile
            </button>
          ) : (
            <FollowButton
              targetUserId={profileUser.id}
              initialIsFollowing={isFollowing}
              onFollowStateChange={handleFollowStateChange}
            />
          )}
        </div>

        <h2 className="text-xl font-bold text-text-primary">@{profileUser.username}</h2>
        {profileUser.bio && <p className="text-text-secondary text-sm mt-1">{profileUser.bio}</p>}

        {/* Stats */}
        <div className="flex items-center gap-6 mt-4">
          <StatItem icon={<FileText className="w-4 h-4" />} count={profileUser._count.notes} label="Notes" />
          <StatItem icon={<Users className="w-4 h-4" />} count={followersCount} label="Followers" />
          <StatItem icon={<Heart className="w-4 h-4" />} count={profileUser._count.following} label="Following" />
        </div>
      </div>

      {editOpen && (
        <EditProfileModal
          user={profileUser}
          onClose={() => setEditOpen(false)}
          onUpdate={handleProfileUpdate}
        />
      )}
    </>
  );
}

function StatItem({ icon, count, label }) {
  return (
    <div className="flex items-center gap-1.5 text-text-secondary text-sm">
      {icon}
      <span className="font-bold text-text-primary">{count}</span>
      <span>{label}</span>
    </div>
  );
}
