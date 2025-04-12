export default function CreateListPage() {
  return (
    <p>Dupa</p>
  );
} 
/*
import Header from "@/components/header";

type RecommendationType = "Free" | "Paid" | "Premium";

export default function CreateListPage() {



  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8f5ed" }}>
      <Header />
      
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="bg-white rounded-lg border-4 border-[#19191b] p-8 shadow-[8px_8px_0px_0px_#19191b]">
          <h1 className="text-3xl font-bold mb-6">Create New Recommendation List</h1>
          
          {error && (
            <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="title"
                className="block text-[#19191b] font-medium mb-2"
              >
                List Title
              </label>
              <input
                id="title"
                type="text"
                className="w-full px-4 py-3 rounded-lg border-2 border-[#19191b] focus:outline-none focus:ring-2 focus:ring-[#8d65e3]/50"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Best Coffee Shops in Berlin"
                required
              />
            </div>
            
            <div className="mb-6">
              <label
                htmlFor="slug"
                className="block text-[#19191b] font-medium mb-2"
              >
                URL Slug
              </label>
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">maplizt.com/your-profile/</span>
                <input
                  id="slug"
                  type="text"
                  className="flex-grow px-4 py-3 rounded-lg border-2 border-[#19191b] focus:outline-none focus:ring-2 focus:ring-[#8d65e3]/50"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder="best-coffee-shops-berlin"
                  required
                />
              </div>
              {isCheckingSlug && (
                <p className="mt-2 text-sm text-gray-500">Checking availability...</p>
              )}
              {slugError && (
                <p className="mt-2 text-sm text-red-500">{slugError}</p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Only lowercase letters, numbers, and hyphens. This will be your public URL.
              </p>
            </div>
            
            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-[#19191b] font-medium mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                className="w-full px-4 py-3 rounded-lg border-2 border-[#19191b] focus:outline-none focus:ring-2 focus:ring-[#8d65e3]/50 min-h-[120px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this list is about..."
                required
              />
            </div>
            
            <div className="mb-6">
              <label
                htmlFor="googleMapsLink"
                className="block text-[#19191b] font-medium mb-2"
              >
                Google Maps Link
              </label>
              <input
                id="googleMapsLink"
                type="url"
                className="w-full px-4 py-3 rounded-lg border-2 border-[#19191b] focus:outline-none focus:ring-2 focus:ring-[#8d65e3]/50"
                value={googleMapsLink}
                onChange={(e) => setGoogleMapsLink(e.target.value)}
                placeholder="https://www.google.com/maps/..."
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                Provide a link to the Google Maps location for this recommendation.
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-[#19191b] font-medium mb-2">
                List Type
              </label>
              <div className="grid grid-cols-3 gap-4">
                <button
                  type="button"
                  className={`p-4 rounded-lg border-2 ${
                    type === "Free"
                      ? "bg-[#97b5ec] border-[#19191b]"
                      : "bg-white border-gray-300"
                  }`}
                  onClick={() => setType("Free")}
                >
                  <div className="font-bold">Free</div>
                  <div className="text-sm">No cost</div>
                </button>
                
                <button
                  type="button"
                  className={`p-4 rounded-lg border-2 ${
                    type === "Paid"
                      ? "bg-[#7db48f] border-[#19191b]"
                      : "bg-white border-gray-300"
                  }`}
                  onClick={() => setType("Paid")}
                >
                  <div className="font-bold">Paid</div>
                  <div className="text-sm">Low cost</div>
                </button>
                
                <button
                  type="button"
                  className={`p-4 rounded-lg border-2 ${
                    type === "Premium"
                      ? "bg-[#f7bdf6] border-[#19191b]"
                      : "bg-white border-gray-300"
                  }`}
                  onClick={() => setType("Premium")}
                >
                  <div className="font-bold">Premium</div>
                  <div className="text-sm">High value</div>
                </button>
              </div>
            </div>
            
            {type !== "Free" && (
              <div className="mb-6">
                <label
                  htmlFor="price"
                  className="block text-[#19191b] font-medium mb-2"
                >
                  Price (in PLN)
                </label>
                <div className="flex items-center">
                  <input
                    id="price"
                    type="number"
                    min={type === "Premium" ? 7 : 1}
                    className="w-full px-4 py-3 rounded-lg border-2 border-[#19191b] focus:outline-none focus:ring-2 focus:ring-[#8d65e3]/50"
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                    required
                  />
                  <span className="ml-2 text-gray-500">PLN</span>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {type === "Premium" 
                    ? "Premium lists must cost at least 7 PLN" 
                    : "Paid lists must cost at least 1 PLN"}
                </p>
              </div>
            )}
            
            <div className="flex justify-end gap-4 mt-8">
              <button
                type="button"
                className="px-6 py-3 bg-white text-[#19191b] rounded-lg border-2 border-[#19191b] font-medium hover:bg-gray-100 transition"
                onClick={() => router.push("/dashboard")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-[#19191b] text-white rounded-lg border-2 border-[#19191b] font-medium hover:bg-opacity-90 transition"
                disabled={isSubmitting || !!slugError}
              >
                {isSubmitting ? "Creating..." : "Create List"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 
*/