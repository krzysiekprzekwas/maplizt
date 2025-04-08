import Link from "next/link"


export default async function NotFoundPage() {

  return (
    <div className="min-h-screen bg-[#f8f5ed] relative">
      <div className="max-w-2xl mx-auto px-4 py-6 relative z-20">
        <div className="max-w-lg mx-auto text-center py-12">
          <h1 className="text-5xl font-bold  mb-8">Nothing to see here!</h1>
          <p className=" text-lg mb-16">
            Looks like you hit dead end. Check the link again as we have no recommendation nor recommenders in here. Good luck!
          </p>

          <div className="space-y-4">

            <Link href={`/`} className="block">
              <button className="w-full bg-white  font-bold text-xl py-4 rounded-lg border-4 border-[#19191b] brutal-shadow-all">
                Home
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative circles */}
      <div className="fixed bottom-6 right-4 w-40 h-40 opacity-80 z-10">
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-[#e47a5e] rounded-full"></div>
        <div className="absolute bottom-20 right-0 w-20 h-20 bg-[#e47a5e] rounded-full"></div>
        <div className="absolute bottom-0 right-20 w-20 h-20 bg-[#e47a5e] rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 bg-[#e47a5e] rounded-full"></div>
      </div>
    </div>
  )
}

