'use client';

import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

interface CommentProps {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
    avatar_url?: string;
  };
  onDelete?: (id: string) => void;
}

const Comment = ({ content, createdAt, user, id, onDelete }: CommentProps) => {
  return (
    <div className="flex space-x-4 p-4 bg-white rounded-lg shadow-sm">
      {/* Profil Fotoğrafı */}
      <div className="flex-shrink-0">
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100">
          {user.avatar_url ? (
            <Image
              src={user.avatar_url}
              alt={`${user.email} profil fotoğrafı`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Yorum İçeriği */}
      <div className="flex-grow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">{user.email}</p>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: tr })}
            </p>
          </div>
          {onDelete && (
            <button
              onClick={() => onDelete(id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>
        <p className="mt-2 text-sm text-gray-700">{content}</p>
      </div>
    </div>
  );
};

export default Comment; 