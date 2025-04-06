import { Influencer } from "@/types/database"
import Link from "next/link"
import Image from "next/image"

interface InfluencerHeaderProps {
  influencer: Influencer
}

export default function InfluencerHeader({ influencer }: InfluencerHeaderProps) {
  return (
    <div className="bg-[#ffffff] border-b border-[#19191b]">
      <div className="p-4">
        <div className="flex items-center gap-4">
          <Link href={`/${influencer.slug}`}>
            <div className="w-[80px] h-[80px] rounded-lg overflow-hidden border-2 border-[#19191b] neobrutalist-shadow">
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

