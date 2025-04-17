import { redirect } from "next/navigation";


// Recommendation type styling utility
export function getRecommendationTypeStyle(type: string): string {
  switch (type?.toLowerCase()) {
    case 'free':
      return 'bg-[#97b5ec] text-black';
    case 'paid':
      return 'bg-[#7db48f] text-black';
    case 'premium':
      return 'bg-[#f7bdf6] text-black';
    default:
      return 'bg-gray-200 text-gray-800';
  }
}

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string,
) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}
