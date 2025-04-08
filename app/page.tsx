import Link from "next/link";
import Image from "next/image";
import Header from "@/components/header";

export default function HomePage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "#f8f5ed" }}>
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Share Your Maps, <span className="text-[#8d65e3]">Monetize</span> Your Recommendations
              </h1>
              <p className="text-lg mb-8 max-w-lg">
                Create and share Google Maps lists easily with your audience. Turn your travel and local recommendations into revenue.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/signup" 
                  className="bg-[#19191b] text-white px-6 py-3 rounded-lg border-2 border-[#19191b] font-medium hover:bg-opacity-90 transition text-center"
                >
                  Start For Free
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-[400px] bg-white rounded-lg neobrutalist-shadow">
                <Image 
                  src="/recommendation_image_placeholder.jpg" 
                  alt="Maplizt in action" 
                  fill 
                  className="rounded-lg border-4 border-[#19191b]" 
                />
                <div className="absolute rounded-lg inset-0 flex flex-col items-center justify-center p-6">
                  <div className="bg-white p-4 rounded-lg border-2 border-[#19191b] shadow-lg w-full max-w-xs neobrutalist-shadow">
                    <h3 className="font-bold mb-2">Munich's Best Cafés</h3>
                    <p className="text-sm mb-3">Discover 8 perfect spots to work & enjoy breakfast</p>
                    <div className="h-24 bg-[#97b5ec]/20 rounded border border-[#19191b]/30 flex items-center justify-center">
                      <Image src="/globe.svg" alt="Map" width={48} height={48} className="opacity-70" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Maplizt</h2>
            <p className="text-lg max-w-2xl mx-auto">Simple tools to share and monetize your location-based recommendations</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#f8f5ed] p-6 rounded-lg border-2 border-[#19191b] neobrutalist-shadow">
              <div className="w-12 h-12 bg-[#8d65e3]/20 rounded-lg flex items-center justify-center mb-4">
                <Image src="/globe.svg" alt="Map Feature" width={24} height={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Easy Map Integration</h3>
              <p>Connect your Google Maps lists and create beautiful, shareable recommendation pages in minutes.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-[#f8f5ed] p-6 rounded-lg border-2 border-[#19191b] neobrutalist-shadow">
              <div className="w-12 h-12 bg-[#7db48f]/20 rounded-lg flex items-center justify-center mb-4">
                <Image src="/window.svg" alt="Monetize Feature" width={24} height={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Simple Monetization</h3>
              <p>Offer premium location lists to your audience and earn direct revenue from your recommendations.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-[#f8f5ed] p-6 rounded-lg border-2 border-[#19191b] neobrutalist-shadow">
              <div className="w-12 h-12 bg-[#97b5ec]/20 rounded-lg flex items-center justify-center mb-4">
                <Image src="/file.svg" alt="Analytics Feature" width={24} height={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Insightful Analytics</h3>
              <p>Track which recommendations are most popular and optimize your content for better engagement.</p>
            </div>
            
            {/* Feature 4 */}
            <div className="md:col-span-2 lg:col-span-3 bg-[#f7bdf6]/20 p-6 rounded-lg border-2 border-[#19191b] mt-4 neobrutalist-shadow">
              <div className="flex flex-col lg:flex-row items-center gap-6">
                <Image src="/globe.svg" alt="No Technical Skills" width={64} height={64} className="bg-white p-3 rounded-lg border-2 border-[#19191b]" />
                <div>
                  <h3 className="text-xl font-bold mb-2">No Technical Skills Required</h3>
                  <p className="text-lg">Start sharing and earning in minutes with our intuitive platform. Perfect for influencers of all technical abilities.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16" style={{ backgroundColor: "#f8f5ed" }}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-lg max-w-2xl mx-auto">Join hundreds of content creators already using Maplizt</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-lg border-2 border-[#19191b] neobrutalist-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#19191b]">
                  <Image src="/avatar_placeholder.jpeg" alt="User" width={48} height={48} className="object-cover" />
                </div>
                <div>
                  <h4 className="font-bold">Sarah L.</h4>
                  <p className="text-sm">Travel Blogger</p>
                </div>
              </div>
              <p className="italic">"Maplizt has completely changed how I share travel recommendations. My audience loves the interactive maps, and I've seen a 30% increase in engagement."</p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-lg border-2 border-[#19191b] neobrutalist-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#19191b]">
                  <Image src="/avatar_placeholder.jpeg" alt="User" width={48} height={48} className="object-cover" />
                </div>
                <div>
                  <h4 className="font-bold">Mark T.</h4>
                  <p className="text-sm">Food Influencer</p>
                </div>
              </div>
              <p className="italic">"I was skeptical about monetizing my restaurant recommendations, but within the first month, I made enough to cover my dining expenses. It's a game-changer!"</p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-lg border-2 border-[#19191b] neobrutalist-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#19191b]">
                  <Image src="/avatar_placeholder.jpeg" alt="User" width={48} height={48} className="object-cover" />
                </div>
                <div>
                  <h4 className="font-bold">Emma R.</h4>
                  <p className="text-sm">Lifestyle Creator</p>
                </div>
              </div>
              <p className="italic">"As someone with limited tech skills, I was amazed at how easy Maplizt is to use. Set up my first paid map in under 10 minutes and my followers love it!"</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg max-w-2xl mx-auto">Start for free and upgrade as your audience grows</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-[#f8f5ed] p-8 rounded-lg border-2 border-[#19191b] neobrutalist-shadow">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <p className="text-lg mb-6">Perfect for getting started</p>
              <p className="text-4xl font-bold mb-6">$0<span className="text-lg font-normal">/month</span></p>
              
              <ul className="mb-8 space-y-3">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#8d65e3]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span>Unlimited public recommendation lists</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#8d65e3]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span>Google Maps integration</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#8d65e3]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span>Basic analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#8d65e3]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span>Maplizt branding</span>
                </li>
              </ul>
              
              <Link 
                href="/signup" 
                className="block w-full bg-white text-center py-3 rounded-lg border-2 border-[#19191b] font-medium hover:bg-[#f8f5ed] transition"
              >
                Get Started
              </Link>
            </div>
            
            {/* Pro Plan */}
            <div className="bg-[#8d65e3]/10 p-8 rounded-lg border-2 border-[#19191b] relative neobrutalist-shadow">
              <div className="absolute -top-4 right-4 bg-[#8d65e3] text-white px-4 py-1 rounded-lg text-sm font-medium border-2 border-[#19191b]">
                POPULAR
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-lg mb-6">For serious creators</p>
              <p className="text-4xl font-bold mb-6">$19<span className="text-lg font-normal">/month</span></p>
              
              <ul className="mb-8 space-y-3">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#8d65e3]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span>Everything in Free</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#8d65e3]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span>Monetize premium recommendations</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#8d65e3]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span>Custom branding</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#8d65e3]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span>Advanced analytics & insights</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#8d65e3]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span>Priority support</span>
                </li>
              </ul>
              
              <Link 
                href="/signup" 
                className="block w-full bg-[#8d65e3] text-white text-center py-3 rounded-lg border-2 border-[#19191b] font-medium hover:bg-opacity-90 transition"
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16" style={{ backgroundColor: "rgba(255, 220, 154, 0.3)" }}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Monetizing Your Recommendations?</h2>
            <p className="text-lg mb-8">Join thousands of influencers already using Maplizt to share their favorite places and earn from their recommendations.</p>
            <Link 
              href="/signup" 
              className="inline-block bg-[#19191b] text-white px-8 py-4 rounded-lg border-2 border-[#19191b] font-medium hover:bg-opacity-90 transition text-lg"
            >
              Get Started For Free
            </Link>
            <p className="mt-4 text-sm">No credit card required. Free forever plan available.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#19191b] text-white py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image src="/globe.svg" alt="Maplizt Logo" width={24} height={24} className="invert" />
                <span className="text-xl font-bold">Maplizt</span>
              </div>
              <p className="text-sm text-gray-300 mb-4">The easiest way to monetize your location-based recommendations.</p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-300 hover:text-white transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-gray-300 hover:text-white transition">Features</Link></li>
                <li><Link href="#pricing" className="text-gray-300 hover:text-white transition">Pricing</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white transition">Testimonials</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white transition">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-300 hover:text-white transition">About</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white transition">Blog</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white transition">Careers</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-300 hover:text-white transition">Privacy Policy</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white transition">Terms of Service</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white transition">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} Maplizt. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

