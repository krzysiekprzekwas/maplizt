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
                Share and sell Google Maps lists easily with your audience. Turn your travel and local recommendations into revenue.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/auth/sign-up" 
                  className="bg-[#19191b] text-white px-6 py-3 rounded-lg border-2 border-[#19191b] font-medium hover:bg-opacity-90 transition text-center"
                >
                  Start For Free
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-[400px] bg-white rounded-lg brutal-shadow-all">
                <Image 
                  src="/recommendation_image_placeholder.jpg" 
                  alt="Maplizt in action" 
                  fill 
                  className="rounded-lg border-4 border-[#19191b]" 
                />
                <div className="absolute rounded-lg inset-0 flex flex-col items-center justify-center p-6">
                  <div className="bg-white p-4 rounded-lg border-2 border-[#19191b] shadow-lg w-full max-w-xs brutal-shadow-all">
                    <h3 className="font-bold mb-2">Munich's Best Cafés</h3>
                    <p className="text-sm mb-3">Discover 8 perfect spots to work & enjoy breakfast</p>
                    <div className="h-32 relative bg-[#97b5ec]/20 rounded border border-[#19191b]/30 flex items-center justify-center">
                      <Image src="/munich-demo.png" alt="Map" fill className="opacity-70 object-cover" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg max-w-2xl mx-auto">Start monetizing your recommendations in just three simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="bg-[#f8f5ed] p-6 rounded-lg border-2 border-[#19191b] brutal-shadow-all">
              <div className="w-12 h-12 bg-[#8d65e3]/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-[#8d65e3]">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Create Your Google Maps List</h3>
              <p className="text-gray-600">Start by creating a list of your favorite places in Google Maps. Add detailed descriptions and photos to make your recommendations stand out.</p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-[#f8f5ed] p-6 rounded-lg border-2 border-[#19191b] brutal-shadow-all">
              <div className="w-12 h-12 bg-[#8d65e3]/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-[#8d65e3]">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Set Up Your Maplizt Store</h3>
              <p className="text-gray-600">Connect your Google Maps list to Maplizt and customize your store. Set your pricing and make your recommendations available to your audience.</p>
            </div>
            
            {/* Step 3 */}
            <div className="bg-[#f8f5ed] p-6 rounded-lg border-2 border-[#19191b] brutal-shadow-all">
              <div className="w-12 h-12 bg-[#8d65e3]/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-[#8d65e3]">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Start Sharing!</h3>
              <p className="text-gray-600">Share your Maplizt store with your audience. They can purchase access to your recommendations and you'll earn revenue from every sale.</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/kristof-pro" 
              className="inline-block bg-[#19191b] text-white px-8 py-4 rounded-lg border-2 border-[#19191b] font-medium hover:bg-opacity-90 transition text-lg"
            >
              View Sample Maplizt Store
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Maplizt</h2>
            <p className="text-lg max-w-2xl mx-auto">Simple tools to share and monetize your location-based recommendations</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg border-2 border-[#19191b] brutal-shadow-all">
              <div className="w-12 h-12 bg-[#8d65e3]/20 rounded-lg flex items-center justify-center mb-4">
                <Image src="/maplizt-logo-icon.svg" alt="Map Feature" width={24} height={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Easy Map Integration</h3>
              <p>Connect your Google Maps lists and create beautiful, shareable recommendation pages in minutes.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg border-2 border-[#19191b] brutal-shadow-all">
              <div className="w-12 h-12 bg-[#7db48f]/20 rounded-lg flex items-center justify-center mb-4">
                <Image src="/window.svg" alt="Monetize Feature" width={24} height={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Simple Monetization</h3>
              <p>Offer premium location lists to your audience and earn direct revenue from your recommendations.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg border-2 border-[#19191b] brutal-shadow-all">
              <div className="w-12 h-12 bg-[#97b5ec]/20 rounded-lg flex items-center justify-center mb-4">
                <Image src="/file.svg" alt="Analytics Feature" width={24} height={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Insightful Analytics</h3>
              <p>Track which recommendations are most popular and optimize your content for better engagement.</p>
            </div>
            
            {/* Feature 4 */}
            <div className="md:col-span-2 lg:col-span-3 bg-[#f7bdf6]/20 p-6 rounded-lg border-2 border-[#19191b] mt-4 brutal-shadow-all">
              <div className="flex flex-col lg:flex-row items-center gap-6">
                <Image src="/maplizt-logo-icon.svg" alt="No Technical Skills" width={64} height={64} className="bg-white p-3 rounded-lg border-2 border-[#19191b]" />
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
      <section id="testimonials" className="py-16 bg-[#97b5ec]/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-lg max-w-2xl mx-auto">Join hundreds of content creators already using Maplizt</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-lg border-2 border-[#19191b] brutal-shadow-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#19191b]">
                  <Image src="/avatar_placeholder.png" alt="User" width={48} height={48} className="object-cover" />
                </div>
                <div>
                  <h4 className="font-bold">Sarah L.</h4>
                  <p className="text-sm">Travel Blogger</p>
                </div>
              </div>
              <p className="italic">"Maplizt has completely changed how I share travel recommendations. My audience loves the interactive maps, and I've seen a 30% increase in engagement."</p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-lg border-2 border-[#19191b] brutal-shadow-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#19191b]">
                  <Image src="/avatar_placeholder.png" alt="User" width={48} height={48} className="object-cover" />
                </div>
                <div>
                  <h4 className="font-bold">Mark T.</h4>
                  <p className="text-sm">Food Influencer</p>
                </div>
              </div>
              <p className="italic">"I was skeptical about monetizing my restaurant recommendations, but within the first month, I made enough to cover my dining expenses. It's a game-changer!"</p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-lg border-2 border-[#19191b] brutal-shadow-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#19191b]">
                  <Image src="/avatar_placeholder.png" alt="User" width={48} height={48} className="object-cover" />
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
      <section id="pricing" className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg max-w-2xl mx-auto">Start for free and upgrade as your audience grows</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white p-8 rounded-lg border-2 border-[#19191b] brutal-shadow-all">
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
                  <span><b>10% commision</b> on paid recommendation</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#8d65e3]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span>Maplizt branding</span>
                </li>
              </ul>
              
              <Link 
                href="/auth/sign-up" 
                className="block w-full bg-white text-center py-3 rounded-lg border-2 border-[#19191b] font-medium hover:bg-[#8d65e3]/10 transition"
              >
                Get Started
              </Link>
            </div>
            
            {/* Pro Plan */}
            <div className="bg-[#8d65e3]/10 p-8 rounded-lg border-2 border-[#19191b] relative brutal-shadow-all">
              <div className="absolute -top-4 right-4 bg-[#8d65e3] text-white px-4 py-1 rounded-lg text-sm font-medium border-2 border-[#19191b]">
                Soon
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-lg mb-6">For serious creators</p>
              <p className="text-4xl font-bold mb-6">$?<span className="text-lg font-normal">/month</span></p>
              
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
              href="/auth/sign-up" 
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
                <Image src="/maplizt-logo-icon.svg" alt="Maplizt Logo" width={24} height={24} className="invert" />
                <span className="text-xl font-bold">Maplizt</span>
              </div>
              <p className="text-sm text-gray-300 mb-4">The easiest way to monetize your location-based recommendations.</p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-gray-300 hover:text-white transition">Features</Link></li>
                <li><Link href="#pricing" className="text-gray-300 hover:text-white transition">Pricing</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white transition">Testimonials</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="https://kristof.pro" className="text-gray-300 hover:text-white transition">About</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="https://www.freeprivacypolicy.com/live/659b2d7e-aa8d-49d1-8054-3d7e698d2e1d" className="text-gray-300 hover:text-white transition">Privacy Policy</Link></li>
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

