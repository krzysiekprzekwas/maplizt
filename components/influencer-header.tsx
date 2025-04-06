import Image from "next/image"
import type { Influencer } from "@/lib/data"
import BrutalShadow from "./brutal-shadow"

interface InfluencerHeaderProps {
  influencer: Influencer
}

export default function InfluencerHeader({ influencer }: InfluencerHeaderProps) {
  return (
    <div className="bg-[#f8f5ed] border-b border-[#19191b]">
      <div className="px-4 pb-4">
        <div className="flex items-center gap-4">
          <BrutalShadow>
            <div className="w-[80px] h-[80px] rounded-lg overflow-hidden border-4 border-[#19191b]">
              <Image
                src={influencer.profileImage || "/avatar_placeholder.jpeg"}
                alt={influencer.name}
                width={80}
                height={80}
                className="object-cover"
              />
            </div>
          </BrutalShadow>
          <div>
            <h2 className="text-3xl font-bold text-[#19191b]">{influencer.name}</h2>
            <p className="text-lg text-[#19191b]">{influencer.handle}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

