'use client';

import { Tag } from 'lucide-react';

interface ProductTag {
  id: string;
  name: string;
}

interface ProductTagsProps {
  tags?: ProductTag[];
}

export default function ProductTags({
  tags = [],
}: ProductTagsProps) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <div
          key={tag.id}
          className="
            inline-flex
            items-center
            gap-2
            rounded-full
            bg-[#FAFAF8]
            px-3
            py-1.5
            text-xs
            font-medium
            text-gray-600
            transition
            hover:bg-[#1B7979]
            hover:text-white
          "
        >
          <Tag size={13} />
          {tag.name}
        </div>
      ))}
    </div>
  );
}