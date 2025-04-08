import { Influencer } from "@/types/database"
import Link from "next/link"
import Image from "next/image"

interface InfluencerHeaderProps {
  influencer: Influencer
}

export default function InfluencerHeader({ influencer }: InfluencerHeaderProps) {

  if (!influencer) {
    return null;
  }

  return (
    <div className="w-full border-b-2 border-[#19191b] bg-[#ffffff]">
      <div className="p-4 max-w-2xl mx-auto">
        <div className="flex items-center gap-4">
          <Link href={`/${influencer.slug}`}>
            <div className="w-[80px] h-[80px] rounded-lg overflow-hidden border-2 border-[#19191b] brutal-shadow-all">
              <Image
                src={influencer.profile_image || "/avatar_placeholder.jpeg"}
                alt={influencer.name}
                width={80}
                height={80}
                className="object-cover"
              />
            </div>
          </Link>

          <div>
            <h2 className="text-3xl font-bold ">{influencer.name}</h2>
            <p className="text-lg ">{influencer.handle}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

